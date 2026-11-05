import pytest
from starlette.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_full_pipeline():
    print("\n--- 1. Testing Health & Public Endpoints ---")
    res = client.get("/api/health")
    assert res.status_code == 200
    assert "PostgreSQL" in res.json().get("app", "")

    # Products list
    prods = client.get("/api/products").json()
    assert len(prods) >= 3
    print(f"Verified {len(prods)} products on PostgreSQL")

    # Single product
    gulf = client.get("/api/products/gulf").json()
    assert gulf["code"] == "gulf"
    assert gulf["mrp"] == 999.0
    assert gulf["warranty_months"] == 9
    print("Verified Gulf: ₹999, 9 months")

    rock = client.get("/api/products/rock").json()
    assert rock["code"] == "rock"
    assert rock["mrp"] == 1199.0
    assert rock["warranty_months"] == 12
    print("Verified Rock: ₹1,199, 12 months")

    thor = client.get("/api/products/thor").json()
    assert thor["code"] == "thor"
    assert thor["mrp"] == 1499.0
    assert thor["is_heavy_vehicle"] is True
    print("Verified Thor: ₹1,499, Heavy Vehicle grade")

    print("\n--- 2. Testing Quote Submissions ---")
    # Retail quote
    ret_res = client.post("/api/quotes/retail", json={
        "full_name": "Test Customer",
        "phone": "+91 98765 00000",
        "city": "Bikaner",
        "product_code": "rock",
        "product_name": "Tyre Puncture Vaccine Rock",
        "quantity": 2,
        "vehicle_type": "Scorpio",
        "message": "Testing retail order"
    })
    assert ret_res.status_code == 201
    ret_data = ret_res.json()
    assert ret_data["quote_number"].startswith("RQ-")
    print(f"Retail Quote created: {ret_data['quote_number']}")

    # Bulk quote
    bulk_res = client.post("/api/quotes/bulk", json={
        "business_name": "Marwar Logistics",
        "contact_person": "Praveen Singh",
        "phone": "+91 98765 11111",
        "email": "praveen@marwar.com",
        "city": "Jaipur",
        "district": "Jaipur",
        "state": "Rajasthan",
        "product_code": "thor",
        "estimated_quantity": "10 Cartons (120 bottles)",
        "gst_number": "08ABCDE1234F1Z5",
        "message": "Fleet requirement for 15 trucks"
    })
    assert bulk_res.status_code == 201
    bulk_data = bulk_res.json()
    assert bulk_data["quote_number"].startswith("BQ-")
    print(f"Bulk Quote created: {bulk_data['quote_number']}")

    # Distributor application
    dist_res = client.post("/api/distributors/apply", json={
        "full_name": "Dinesh Sharma",
        "phone": "+91 94140 22222",
        "email": "dinesh@gmail.com",
        "city": "Nagaur",
        "district": "Nagaur",
        "tehsil": "Didwana",
        "state": "Rajasthan",
        "current_business": "Tyre & Battery Shop",
        "investment_capacity": "₹1,00,000 - ₹2,50,000",
        "message": "Interested in exclusive tehsil distributorship"
    })
    assert dist_res.status_code == 201
    dist_data = dist_res.json()
    assert dist_data["application_number"].startswith("DIST-")
    print(f"Distributor Application created: {dist_data['application_number']}")

    print("\n--- 3. Testing Admin CMS Authentication & Management ---")
    login_res = client.post("/api/auth/login", json={
        "username": "admin",
        "password": "AdminPassword2026!"
    })
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("Admin login successful, JWT token obtained")

    # Update retail quote status
    up_ret = client.put(f"/api/quotes/retail/{ret_data['id']}", json={
        "status": "Called",
        "notes": "Called customer, confirming delivery address"
    }, headers=headers)
    assert up_ret.status_code == 200
    assert up_ret.json()["status"] == "Called"
    print("Updated retail quote status to 'Called' with internal notes")

    # Update bulk quote status
    up_bulk = client.put(f"/api/quotes/bulk/{bulk_data['id']}", json={
        "status": "Quoted",
        "notes": "Special carton freight discount sent"
    }, headers=headers)
    assert up_bulk.status_code == 200
    assert up_bulk.json()["status"] == "Quoted"
    print("Updated bulk quote status to 'Quoted'")

    # Test settings update & WhatsApp switch toggle
    curr_settings = client.get("/api/settings").json()
    assert curr_settings["whatsapp_enabled"] in ["false", "true"]
    
    # Toggle WhatsApp on
    client.put("/api/settings", json={"whatsapp_enabled": "true"}, headers=headers)
    updated_settings = client.get("/api/settings").json()
    assert updated_settings["whatsapp_enabled"] == "true"
    print("Toggled WhatsApp button ON")

    # Toggle WhatsApp off back to blueprint initial state
    client.put("/api/settings", json={"whatsapp_enabled": "false"}, headers=headers)
    updated_settings2 = client.get("/api/settings").json()
    assert updated_settings2["whatsapp_enabled"] == "false"
    print("Toggled WhatsApp button OFF (Blueprint compliant)")

    print("\n--- 4. Testing Search Endpoint ---")
    search_res = client.get("/api/search?q=Gulf").json()
    assert len(search_res["products"]) >= 1
    print("Search query 'Gulf' correctly matched product")

    print("\n ALL INTEGRATION TESTS PASSED ON POSTGRESQL!")

if __name__ == "__main__":
    test_full_pipeline()

