import json
import urllib.request
import urllib.error

API_URL = "http://127.0.0.1:8001/api"

def api_call(path, method="GET", data=None, token=None):
    url = f"{API_URL}{path}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    encoded_data = json.dumps(data).encode("utf-8") if data is not None else None
    req = urllib.request.Request(url, data=encoded_data, headers=headers, method=method)
    
    try:
        with urllib.request.urlopen(req) as resp:
            body = resp.read().decode("utf-8")
            return resp.status, json.loads(body) if body else {}
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        try:
            return e.code, json.loads(body)
        except:
            return e.code, {"error": body}

def run_tests():
    print("=" * 65)
    print("TYRE PUNCTURE VACCINE - COMPREHENSIVE VERIFICATION SUITE")
    print("=" * 65)

    results = []

    # ---------------------------------------------------------
    # 1. VERIFY AUTHENTICATION & ACCESS CONTROL
    # ---------------------------------------------------------
    print("\n[1] AUTHENTICATION & PERMISSIONS TESTING:")
    
    # 1.1 Invalid Admin Login
    status, res = api_call("/auth/login", method="POST", data={"username": "admin", "password": "WrongPassword!"})
    passed = status == 401
    results.append(("Admin Invalid Password Rejection", passed))
    print(f"  ✓ Rejection of invalid credentials: {passed} (Status: {status})")

    # 1.2 Valid Admin Login
    status, res = api_call("/auth/login", method="POST", data={"username": "admin", "password": "AdminPassword2026!"})
    admin_token = res.get("access_token") if status == 200 else None
    passed = status == 200 and admin_token is not None
    results.append(("Admin Valid Login & Token Issue", passed))
    print(f"  ✓ Admin JWT Token Issuance: {passed} (User: {res.get('user', {}).get('username')})")

    # 1.3 Protected Route without Token
    status, res = api_call("/orders", method="GET")
    passed = status == 401
    results.append(("Protected Admin Route Enforced (No Token)", passed))
    print(f"  ✓ Unauthorized access blocked without token: {passed}")

    # 1.4 Protected Route with Admin Token
    status, res = api_call("/orders", method="GET", token=admin_token)
    passed = status == 200
    results.append(("Admin Authenticated Orders API Access", passed))
    print(f"  ✓ Admin Token Verified on Protected Route: {passed} (Total orders in DB: {len(res) if isinstance(res, list) else 0})")

    # 1.5 Password Reset Flow
    status, res = api_call("/auth/forgot-password", method="POST", data={"identifier": "admin"})
    reset_token = res.get("reset_token")
    passed = status == 200 and reset_token is not None
    results.append(("Password Reset Token Generation", passed))
    print(f"  ✓ Forgot Password Verification Token Generated: {passed}")

    # Reset password back to AdminPassword2026!
    status, res = api_call("/auth/reset-password", method="POST", data={"token": reset_token, "new_password": "AdminPassword2026!"})
    passed = status == 200 and res.get("status") == "success"
    results.append(("Password Reset Execution", passed))
    print(f"  ✓ Password Reset Execution Verified: {passed}")

    # ---------------------------------------------------------
    # 2. VERIFY INITIAL DEFAULT MODE A (QUOTATION ONLY)
    # ---------------------------------------------------------
    print("\n[2] INITIAL DEFAULT MODE A (QUOTATION ONLY) TESTING:")

    status, settings = api_call("/settings")
    mode = settings.get("business_mode")
    ecom_enabled = settings.get("ecommerce_enabled")
    passed = mode == "quotation" and ecom_enabled == "false"
    results.append(("Default Business Mode is Mode A (Quotation Only)", passed))
    print(f"  ✓ Active Business Mode: {mode} (Mode A Quotation Only)")
    print(f"  ✓ E-Commerce Master Flag: {ecom_enabled} (Disabled by default)")

    # 2.1 Direct Checkout Blocked in Mode A
    test_order_mode_a = {
        "customer_name": "Test Blocked User",
        "customer_phone": "9876543210",
        "shipping_address": "Test Street",
        "city": "Bikaner",
        "pin_code": "334001",
        "subtotal": 1199,
        "total_amount": 1199,
        "items": [
            {
                "product_id": 2,
                "product_code": "rock",
                "product_name": "Tyre Puncture Vaccine Rock",
                "unit_price": 1199,
                "quantity": 1,
                "total_price": 1199
            }
        ]
    }
    status, res = api_call("/orders", method="POST", data=test_order_mode_a)
    passed = status == 400 and "disabled" in str(res.get("detail", "")).lower()
    results.append(("Server Blocks Direct Orders in Mode A", passed))
    print(f"  ✓ Direct purchasing rejected in Mode A: {passed} (Detail: {res.get('detail')})")

    # 2.2 Retail Quotation Submission in Mode A
    retail_quote_payload = {
        "full_name": "Dungar Singh",
        "phone": "+91 94141 99999",
        "city": "Bikaner",
        "product_code": "rock",
        "product_name": "Tyre Puncture Vaccine Rock",
        "quantity": 2,
        "vehicle_type": "Mahindra Thar 4x4",
        "message": "Testing retail quotation"
    }
    status, res = api_call("/quotes/retail", method="POST", data=retail_quote_payload)
    quote_num = res.get("quote_number")
    passed = status == 201 and quote_num is not None
    results.append(("Retail Quotation Submission (Mode A)", passed))
    print(f"  ✓ Retail Quote Created: {passed} (Ref: {quote_num})")

    # 2.3 Wholesale Mixed-Product Quotation (Combined MOQ 10 Bottles) in Mode A
    bulk_quote_payload = {
        "business_name": "Desert Highway Transporters",
        "contact_person": "Surendra Choudhary",
        "phone": "+91 98290 88888",
        "email": "deserttrans@example.com",
        "city": "Bikaner",
        "state": "Rajasthan",
        "product_code": "gulf,rock,thor",
        "estimated_quantity": "10 Bottles (GULF: 4, ROCK: 3, THOR: 3)",
        "items_json": json.dumps([
            {"code": "gulf", "name_en": "Gulf", "qty": 4},
            {"code": "rock", "name_en": "Rock", "qty": 3},
            {"code": "thor", "name_en": "Thor", "qty": 3}
        ]),
        "total_bottles": 10,
        "message": "Commercial fleet mixed order quotation test"
    }
    status, res = api_call("/quotes/bulk", method="POST", data=bulk_quote_payload)
    bulk_quote_num = res.get("quote_number")
    passed = status == 201 and bulk_quote_num is not None
    results.append(("Wholesale 10-Bottle Mixed Quotation Submission (Mode A)", passed))
    print(f"  ✓ Wholesale Mixed Quote Created: {passed} (Ref: {bulk_quote_num})")

    # ---------------------------------------------------------
    # 3. VERIFY BUSINESS MODE SWITCHING (MODE B & MODE C)
    # ---------------------------------------------------------
    print("\n[3] BUSINESS MODE SWITCHING & E-COMMERCE ENGINE:")

    # 3.1 Switch to Mode B (Complete E-commerce)
    mode_b_update = {
        "business_mode": "ecommerce",
        "ecommerce_enabled": "true",
        "allow_add_to_cart": "true",
        "allow_buy_now": "true",
        "allow_guest_checkout": "true",
        "enable_cod": "true",
        "enable_coupons": "true",
        "enable_order_tracking": "true"
    }
    status, res = api_call("/settings", method="PUT", data=mode_b_update, token=admin_token)
    passed = status == 200
    results.append(("Admin Switch to Mode B (Complete E-commerce)", passed))
    print(f"  ✓ Admin Switched to Mode B: {passed}")

    # 3.2 Place Order in Mode B with Coupon & Stock Decrement
    status, coupon_res = api_call("/coupons/validate", method="POST", data={"code": "WELCOME10", "cart_value": 2398})
    discount_val = coupon_res.get("discount_amount", 0) if coupon_res.get("valid") else 0
    print(f"  ✓ Coupon WELCOME10 Validated: {coupon_res.get('valid')} (Discount: ₹{discount_val})")

    mode_b_order = {
        "customer_name": "Vikram Rathore",
        "customer_phone": "9414055555",
        "customer_email": "vikram@example.com",
        "shipping_address": "Near Kote Gate",
        "city": "Bikaner",
        "state": "Rajasthan",
        "pin_code": "334001",
        "subtotal": 2398,
        "discount_amount": discount_val,
        "shipping_fee": 0,
        "total_amount": 2398 - discount_val,
        "payment_method": "COD",
        "items": [
            {
                "product_id": 2,
                "product_code": "rock",
                "product_name": "Tyre Puncture Vaccine Rock",
                "unit_price": 1199,
                "quantity": 2,
                "total_price": 2398
            }
        ]
    }
    status, order_res = api_call("/orders", method="POST", data=mode_b_order)
    order_id = order_res.get("id")
    order_num = order_res.get("order_number")
    passed = status == 201 and order_num is not None
    results.append(("Direct Order Placement in Mode B", passed))
    print(f"  ✓ Order Placed in Mode B: {passed} (Order #: {order_num})")

    # 3.3 Order Status Pipeline & Tracking Update
    status, stat_res = api_call(f"/orders/{order_id}", method="PUT", data={"order_status": "Dispatched", "shipping_partner": "Blue Dart Express", "tracking_number": "BD-88291024"}, token=admin_token)
    passed = status == 200 and stat_res.get("shipping_partner") == "Blue Dart Express"
    results.append(("Order Courier Dispatch & Tracking Update", passed))
    print(f"  ✓ Order Status Updated to Dispatched with Courier: {passed}")

    # 3.4 Switch to Mode C (Hybrid)
    mode_c_update = {
        "business_mode": "hybrid",
        "ecommerce_enabled": "true",
        "allow_add_to_cart": "true",
        "allow_buy_now": "true",
        "enable_cod": "true"
    }
    status, res = api_call("/settings", method="PUT", data=mode_c_update, token=admin_token)
    passed = status == 200
    results.append(("Admin Switch to Mode C (Hybrid)", passed))
    print(f"  ✓ Admin Switched to Mode C (Hybrid): {passed}")

    # 3.5 Revert Back to Initial Default Mode A (Quotation Only)
    mode_a_revert = {
        "business_mode": "quotation",
        "ecommerce_enabled": "false",
        "allow_add_to_cart": "false",
        "allow_buy_now": "false",
        "allow_guest_checkout": "false",
        "enable_cod": "false"
    }
    status, res = api_call("/settings", method="PUT", data=mode_a_revert, token=admin_token)
    passed = status == 200
    results.append(("System Reverted to Initial Default Mode A (Quotation Only)", passed))
    print(f"  ✓ System Reverted to Mode A (Quotation Only) as Required: {passed}")

    # ---------------------------------------------------------
    # 4. VERIFY CRM, ANALYTICS & DATA PRESERVATION
    # ---------------------------------------------------------
    print("\n[4] CRM, ANALYTICS & DATA INTEGRITY:")

    # 4.1 CRM Leads
    status, crm_leads = api_call("/crm/leads", method="GET", token=admin_token)
    passed = status == 200 and len(crm_leads) > 0
    results.append(("Centralized CRM Lead Pipeline", passed))
    print(f"  ✓ Central CRM Unified Leads: {passed} (Total leads: {len(crm_leads)})")

    # 4.2 Analytics Funnel
    status, funnel = api_call("/analytics/funnel", method="GET", token=admin_token)
    kpis = funnel.get("kpis", {})
    passed = status == 200 and "total_revenue" in kpis
    results.append(("Sales Funnel & Revenue Analytics", passed))
    print(f"  ✓ Analytics Metrics: {passed} (Gross Revenue: ₹{kpis.get('total_revenue', 0)}, Total Orders: {kpis.get('total_orders', 0)}, AOV: ₹{kpis.get('average_order_value', 0)})")

    # ---------------------------------------------------------
    # SUMMARY
    # ---------------------------------------------------------
    print("\n" + "=" * 65)
    print("VERIFICATION SUMMARY:")
    all_passed = True
    for name, ok in results:
        mark = "✓ PASS" if ok else "✗ FAIL"
        if not ok: all_passed = False
        print(f"  [{mark}] {name}")
    print("=" * 65)
    print(f"FINAL RESULT: {'ALL VERIFICATION CHECKS PASSED (100%)' if all_passed else 'SOME CHECKS FAILED'}")

if __name__ == '__main__':
    run_tests()
