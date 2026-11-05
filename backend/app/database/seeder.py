import os
import shutil
from pathlib import Path
from sqlalchemy.orm import Session
from app.core.security import get_password_hash
from app.core.config import settings
from app.models.models import (
    User, Product, FAQ, SiteSetting, GalleryAlbum, GalleryPhoto,
    EventNews, BlogPost, Testimonial, Dealer
)

def copy_assets():
    root_dir = settings.ROOT_ASSETS_DIR
    media_dir = settings.MEDIA_DIR
    frontend_assets_dir = root_dir / "frontend" / "public" / "assets"
    
    os.makedirs(media_dir, exist_ok=True)
    os.makedirs(frontend_assets_dir, exist_ok=True)
    
    mapping = {
        "Logo.jpeg": "logo.jpeg",
        "Screenshot_90.png": "how-to-use-6steps.png",
        "Screenshot_91.png": "why-choose-us.png",
        "WhatsApp Image 2026-10-31 at 8.20.32 PM.jpeg": "gulf-poster.jpeg",
        "WhatsApp Image 2026-10-31 at 8.20.28 PM.jpeg": "rock-poster.jpeg",
        "WhatsApp Image 2026-10-31 at 8.20.32 PM (1).jpeg": "thor-poster.jpeg",
        "WhatsApp Image 2026-10-31 at 8.20.34 PM.jpeg": "installation-guidelines.jpeg",
        "WhatsApp Image 2026-10-31 at 8.22.40 PM.jpeg": "why-premium-hindi.jpeg",
        "WhatsApp Image 2026-10-31 at 8.20.32 PM (2).jpeg": "distributor-poster-1.jpeg",
        "WhatsApp Image 2026-10-31 at 8.20.33 PM.jpeg": "distributor-poster-2.jpeg",
        "WhatsApp Image 2026-10-31 at 8.20.35 PM.jpeg": "distributor-poster-3.jpeg",
    }
    
    for src_name, dest_name in mapping.items():
        src_file = root_dir / src_name
        if src_file.exists():
            shutil.copy2(src_file, media_dir / dest_name)
            shutil.copy2(src_file, frontend_assets_dir / dest_name)
            print(f"Copied asset: {src_name} -> {dest_name}")

def seed_db(db: Session):
    copy_assets()
    
    # 1. Admin User
    admin = db.query(User).filter(User.username == "admin").first()
    if not admin:
        admin = User(
            username="admin",
            email="ujjalaelectricalsbkn@gmail.com",
            hashed_password=get_password_hash("AdminPassword2026!"),
            full_name="Ujjala Electricals Management",
            role="owner",
            is_active=True
        )
        db.add(admin)
        print("Admin user seeded (username: admin, pass: AdminPassword2026!)")

    # 2. Site Settings
    default_settings = [
        ("phone", "+91 74130 59364", "Primary customer and sales contact"),
        ("email", "ujjalaelectricalsbkn@gmail.com", "Official enquiry email"),
        ("firm_name", "Ujjala Electricals", "Registered business name"),
        ("brand_name", "Tyre Puncture Vaccine", "Brand identity"),
        ("est_year", "2017", "Year of firm establishment"),
        ("address", "Ground Floor, Near S.B.B.J., Rani Bazar, Industrial Area, Bikaner, Rajasthan 334001", "Physical office address"),
        ("whatsapp_enabled", "false", "WhatsApp floating button toggle (cleared by owner)"),
        ("whatsapp_number", "+917413059364", "WhatsApp business phone number"),
        ("hero_tagline_en", "Say Goodbye to Punctures - Seamless Protection for Every Tyre", "English Hero Tagline"),
        ("hero_tagline_hi", "अब पंचर की छुट्टी - बेफिक्र और सुरक्षित सफर", "Hindi Hero Tagline"),
        ("domain", "tyrepuncturevaccine.com", "Official public website domain"),
        ("business_mode", "quotation", "Active Business Mode: quotation, ecommerce, or hybrid"),
        ("ecommerce_enabled", "false", "Master E-commerce enablement flag"),
        ("allow_add_to_cart", "false", "Enable Add to Cart drawer & cart page"),
        ("allow_buy_now", "false", "Enable 1-click Buy Now checkout"),
        ("allow_guest_checkout", "false", "Allow checkout without customer registration"),
        ("allow_customer_registration", "false", "Enable customer account registration and login"),
        ("enable_cod", "false", "Enable Cash on Delivery payment option"),
        ("enable_online_payment", "false", "Enable online payment gateway"),
        ("enable_coupons", "false", "Enable promo coupon code discounts at checkout"),
        ("enable_abandoned_cart_tracking", "true", "Track customer cart drop-offs for WhatsApp recovery"),
        ("enable_order_tracking", "true", "Enable live courier order status tracking"),
        ("enable_returns_refunds", "false", "Enable customer return and replacement requests"),
        ("free_shipping_threshold", "1999", "Order subtotal threshold for Free Delivery across India"),
        ("default_shipping_fee", "99", "Standard shipping fee when subtotal is below free threshold"),
        ("dispatch_warehouse", "Rani Bazar, Industrial Area, Bikaner, Rajasthan", "Central fulfillment facility")
    ]
    for key, value, desc in default_settings:
        setting = db.query(SiteSetting).filter(SiteSetting.key == key).first()
        if not setting:
            db.add(SiteSetting(key=key, value=value, description=desc))

    # 3. Core Opening Products: Gulf, Rock, Thor
    if db.query(Product).count() == 0:
        products = [
            Product(
                code="gulf",
                name_en="Tyre Puncture Vaccine Gulf",
                name_hi="टायर पंचर वैक्सीन गल्फ",
                mrp=999.0,
                warranty_months=9,
                pack_size="1 Litre",
                tyre_type="Tubeless",
                is_heavy_vehicle=False,
                vehicle_summary_en="Two-wheelers, hatchbacks, compact sedans, tubeless tyres",
                vehicle_summary_hi="दोपहिया, हैचबैक, सेडान और सभी ट्यूबलेस टायर",
                description_en="The premier opening formulation engineered for everyday commuter vehicles and tubeless tyres. Provides rapid 4mm sealing with non-corrosive, non-hazardous liquid gel formula.",
                description_hi="दैनिक वाहनों और ट्यूबलेस टायरों के लिए खास फॉर्मूलेशन। 4 मिमी तक के पंचर को तुरंत सील करता है। रबर व रिम के लिए पूरी तरह सुरक्षित और पर्यावरण अनुकूल।",
                features_en="Seals punctures up to 4mm instantly\nSafe for metal and alloy wheels\n9-month manufacturer performance warranty\nIncreases tyre life by up to 20%\nNon-flammable & non-toxic formula",
                features_hi="4 मिमी तक के पंचर तुरंत सील करता है\nमेटल और अलॉय रिम को जंग से बचाता है\n9 महीने की परफॉरमेंस वारंटी\nटायर की उम्र 20% तक बढ़ाता है\nगैर-विषैला और सुरक्षित फॉर्मूला",
                image_url="/assets/gulf-poster.jpeg",
                is_featured=True,
                is_active=True,
                sort_order=1
            ),
            Product(
                code="rock",
                name_en="Tyre Puncture Vaccine Rock",
                name_hi="टायर पंचर वैक्सीन रॉक",
                mrp=1199.0,
                warranty_months=12,
                pack_size="1 Litre",
                tyre_type="Tube & Tubeless",
                is_heavy_vehicle=False,
                vehicle_summary_en="SUVs, luxury sedans, pickups, 3-wheelers, tempos",
                vehicle_summary_hi="एसयूवी, लक्ज़री कारें, पिकअप, ऑटो और टेम्पो",
                description_en="Mid-range high endurance sealant formulated for both tube and tubeless setups. Delivers comprehensive all-weather thermal stability from -30°C to +60°C and extended 12-month protection.",
                description_hi="ट्यूब और ट्यूबलेस दोनों प्रकार के टायरों के लिए मजबूत मिड-रेंज सीलेंट। -30°C से +60°C तक के तापमान में असरदार और पूरे 12 महीने की मजबूत वारंटी।",
                features_en="Suitable for both Tube and Tubeless tyres\nFull 12-month warranty backing\nOperating range from -30°C to +60°C\nHelps improve fuel economy up to 5%\nMaintains optimal tyre cooling in extreme summers",
                features_hi="ट्यूब व ट्यूबलेस दोनों टायरों के लिए उपयुक्त\n12 महीने की पूर्ण वारंटी\n-30°C से +60°C तापमान में पूरी तरह असरदार\nमाइलेज में 5% तक सुधार करने में मददगार\nगर्मियों में टायर को ठंडा रखता है",
                image_url="/assets/rock-poster.jpeg",
                is_featured=True,
                is_active=True,
                sort_order=2
            ),
            Product(
                code="thor",
                name_en="Tyre Puncture Vaccine Thor",
                name_hi="टायर पंचर वैक्सीन थॉर (भारी वाहन)",
                mrp=1499.0,
                warranty_months=12,
                pack_size="1 Litre",
                tyre_type="Tube & Tubeless",
                is_heavy_vehicle=True,
                vehicle_summary_en="Heavy commercial vehicles, buses, multi-axle trucks, tractors",
                vehicle_summary_hi="भारी वाणिज्यिक वाहन, बसें, ट्रक, ट्रेलर और ट्रैक्टर",
                description_en="Official recommendation for heavy vehicles, highway fleets, multi-axle freight trucks, and agricultural equipment. Heavy microfibre reinforcement withstands rigorous highway haulage and extreme load stress.",
                description_hi="भारी वाहनों, बसों, ट्रकों, ट्रेलरों और कृषि उपकरणों के लिए विशेष रूप से अनुशंसित। हाई-ग्रेड माइक्रोफाइबर और रबर मिश्रण भारी लोड और लंबी यात्राओं में पूर्ण सुरक्षा देता है।",
                features_en="Recommended specifically for Heavy Commercial Vehicles\nHeavy-duty rubber and microfibre formulation\nWithstands heavy axle payloads and high heat\n12-month heavy commercial warranty\nMinimizes fleet puncture downtime drastically",
                features_hi="भारी वाहनों और ट्रकों के लिए विशेष रूप से अनुशंसित\nहैवी-ड्यूटी माइक्रोफाइबर व रबर मिश्रण\nभारी लोड और हाई-स्पीड हाईवे हीट में सुरक्षित\n12 महीने की मजबूत कमर्शियल वारंटी\nफ्लीट डाउनटाइम और पंचर खर्च को शून्य करता है",
                image_url="/assets/thor-poster.jpeg",
                is_featured=True,
                is_active=True,
                sort_order=3
            )
        ]
        db.add_all(products)
        print("3 core products seeded: Gulf, Rock, Thor")

    # 4. Bilingual FAQs
    if db.query(FAQ).count() == 0:
        faqs = [
            FAQ(
                category="General",
                question_en="What is Tyre Puncture Vaccine and how does it work?",
                question_hi="टायर पंचर वैक्सीन क्या है और यह कैसे काम करता है?",
                answer_en="Tyre Puncture Vaccine is an advanced preventive liquid sealant installed inside the tyre through the valve nozzle. As the vehicle rolls, centrifugal force spreads a uniform coating inside the tread. When a nail or puncture occurs up to 4mm, tyre pressure forces the sealant into the hole, instantly curing to form a permanent seal.",
                answer_hi="टायर पंचर वैक्सीन एक आधुनिक प्री-पंचर लिक्विड सीलेंट है जिसे वॉल्व के रास्ते टायर के अंदर डाला जाता है। गाड़ी चलने पर यह पूरे टायर के अंदर एक सुरक्षा परत बना लेता है। कील या पंचर होते ही सीलेंट हवा के दबाव से छेद में जाकर उसे तुरंत और हमेशा के लिए सील कर देता है।",
                sort_order=1
            ),
            FAQ(
                category="Usage",
                question_en="Can Tyre Puncture Vaccine be used in both tube and tubeless tyres?",
                question_hi="क्या इसे ट्यूब और ट्यूबलेस दोनों टायरों में इस्तेमाल किया जा सकता है?",
                answer_en="Yes! Our Gulf product is engineered for tubeless tyres, while Rock and Thor formulations work reliably on both tube and tubeless tyre configurations.",
                answer_hi="हाँ! हमारा गल्फ प्रोडक्ट ट्यूबलेस टायरों के लिए है, जबकि रॉक और थॉर दोनों प्रकार (ट्यूब और ट्यूबलेस) के लिए उपयुक्त हैं।",
                sort_order=2
            ),
            FAQ(
                category="Warranty",
                question_en="What warranty is provided with the product?",
                question_hi="प्रोडक्ट पर क्या वारंटी मिलती है?",
                answer_en="Gulf comes with a 9-month manufacturer performance warranty. Rock and Thor provide a 12-month manufacturer performance warranty against punctures up to 4mm in the tread area.",
                answer_hi="गल्फ पर 9 महीने की और रॉक तथा थॉर पर पूरे 12 महीने की निर्माण व परफॉरमेंस वारंटी दी जाती है।",
                sort_order=3
            ),
            FAQ(
                category="Dosage",
                question_en="Which product and dosage is recommended for heavy trucks and buses?",
                question_hi="भारी ट्रकों और बसों के लिए कौन सा प्रोडक्ट और कितनी मात्रा चाहिए?",
                answer_en="We strongly recommend Tyre Puncture Vaccine Thor for all commercial buses and trucks. Typical dosage ranges from 2.4 Litres (R17.5 tyre) to 2.8 Litres (R22.5 tyre) per wheel. Consult our Dosage Guide page for exact requirements.",
                answer_hi="भारी बसों और ट्रकों के लिए हम विशेष रूप से 'थॉर' की सलाह देते हैं। टायर साइज के अनुसार (R17.5 से R22.5) प्रति टायर 2.4 से 2.8 लीटर की आवश्यकता होती है। पूरी जानकारी हमारे डोसेज गाइड पेज पर उपलब्ध है।",
                sort_order=4
            ),
            FAQ(
                category="Distributorship",
                question_en="How can I become a distributor in Rajasthan or other states?",
                question_hi="राजस्थान या अन्य राज्यों में डिस्ट्रीब्यूटर कैसे बन सकते हैं?",
                answer_en="Fill out the Distributorship Application form on this website or contact our Bikaner office directly at +91 74130 59364. We provide full marketing collateral, sample kits, and district/tehsil exclusivity support.",
                answer_hi="वेबसाइट पर दिए गए डिस्ट्रीब्यूटरशिप फॉर्म को भरें या हमारे बीकानेर ऑफिस में +91 74130 59364 पर कॉल करें। हम आपको पूरी मार्केटिंग सामग्री, सैंपल किट और सहयोग प्रदान करते हैं।",
                sort_order=5
            )
        ]
        db.add_all(faqs)
        print("Bilingual FAQs seeded")

    # 5. Gallery Albums
    if db.query(GalleryAlbum).count() == 0:
        albums = [
            GalleryAlbum(
                name_en="Product Lineup",
                name_hi="प्रोडक्ट रेंज",
                slug="products",
                description_en="Official bottles, packaging, and formulas",
                description_hi="आधिकारिक बोतलें, पैकिंग और फॉर्मूलेशन",
                sort_order=1
            ),
            GalleryAlbum(
                name_en="How to Use & Installation",
                name_hi="उपयोग विधि व इंस्टॉलेशन",
                slug="how-to-use",
                description_en="Step-by-step photos and dosage charts",
                description_hi="स्टेप-बाय-स्टेप फोटो और डोसेज चार्ट",
                sort_order=2
            ),
            GalleryAlbum(
                name_en="Distributor Meets & Events",
                name_hi="डिस्ट्रीब्यूटर मीट व इवेंट्स",
                slug="events",
                description_en="Field demonstrations, camps, and announcements",
                description_hi="फील्ड प्रदर्शन, कैंप और घोषणाएं",
                sort_order=3
            ),
            GalleryAlbum(
                name_en="Marketing Posters",
                name_hi="मार्केटिंग पोस्टर्स",
                slug="posters",
                description_en="Official high-resolution print posters",
                description_hi="आधिकारिक हाई-रिज़ॉल्यूशन पोस्टर्स",
                sort_order=4
            )
        ]
        db.add_all(albums)
        db.commit()
        
        # Add initial photos linked to albums
        prod_album = db.query(GalleryAlbum).filter(GalleryAlbum.slug == "products").first()
        use_album = db.query(GalleryAlbum).filter(GalleryAlbum.slug == "how-to-use").first()
        poster_album = db.query(GalleryAlbum).filter(GalleryAlbum.slug == "posters").first()
        
        photos = [
            GalleryPhoto(album_id=prod_album.id, caption_en="Gulf 1 Litre Pack", caption_hi="गल्फ 1 लीटर पैक", image_url="/assets/gulf-poster.jpeg", sort_order=1),
            GalleryPhoto(album_id=prod_album.id, caption_en="Rock 1 Litre All-Rounder", caption_hi="रॉक 1 लीटर ऑल-राउंडर", image_url="/assets/rock-poster.jpeg", sort_order=2),
            GalleryPhoto(album_id=prod_album.id, caption_en="Thor Heavy Vehicle Formula", caption_hi="थॉर भारी वाहन फॉर्मूला", image_url="/assets/thor-poster.jpeg", sort_order=3),
            GalleryPhoto(album_id=use_album.id, caption_en="6-Step Installation Guide", caption_hi="6-स्टेप इंस्टॉलेशन गाइड", image_url="/assets/how-to-use-6steps.png", sort_order=1),
            GalleryPhoto(album_id=use_album.id, caption_en="Dosage Calculation Chart", caption_hi="डोसेज गाइड चार्ट", image_url="/assets/installation-guidelines.jpeg", sort_order=2),
            GalleryPhoto(album_id=use_album.id, caption_en="Why Choose Us Overview", caption_hi="विशेषताएं और लाभ", image_url="/assets/why-choose-us.png", sort_order=3),
            GalleryPhoto(album_id=poster_album.id, caption_en="Hindi Benefits Matrix", caption_hi="हम प्रीमियम क्यों हैं", image_url="/assets/why-premium-hindi.jpeg", sort_order=1),
            GalleryPhoto(album_id=poster_album.id, caption_en="Rajasthan Distributorship Campaign", caption_hi="राजस्थान डिस्ट्रीब्यूटरशिप अभियान", image_url="/assets/distributor-poster-1.jpeg", sort_order=2),
            GalleryPhoto(album_id=poster_album.id, caption_en="Tehsil Employment Opportunity", caption_hi="स्वरोजगार सुनहरा अवसर", image_url="/assets/distributor-poster-2.jpeg", sort_order=3),
        ]
        db.add_all(photos)
        print("Gallery albums and photos seeded")

    # 6. Blog Posts
    if db.query(BlogPost).count() == 0:
        posts = [
            BlogPost(
                title_en="How Preventive Tyre Sealants Reduce Commercial Fleet Downtime",
                title_hi="प्री-पंचर टायर सीलेंट कमर्शियल फ्लीट का समय और खर्च कैसे बचाता है",
                slug="preventive-tyre-sealant-fleet-downtime",
                summary_en="An in-depth analysis of how highway freight fleets save on tyre replacements, roadside repairs, and fuel by installing Tyre Puncture Vaccine Thor.",
                summary_hi="हाईवे ट्रकों और फ्लीट वाहनों में टायर पंचर वैक्सीन थॉर का उपयोग करके टायर की लाइफ, माइलेज और समय की भारी बचत का विश्लेषण।",
                content_en="Every flat tyre on a commercial vehicle incurs not only repair charges but hours of delayed freight schedules. Tyre Puncture Vaccine creates an instantaneous, permanent barrier that seals tread punctures up to 4mm immediately upon penetration. Because it maintains balanced tyre temperatures (-30°C to +60°C) and prevents micro-air loss, fleets also report up to 5% improvements in overall fuel efficiency and a 20% extension in casing life.",
                content_hi="कमर्शियल वाहनों में टायर पंचर होने से न केवल मरम्मत का खर्च आता है बल्कि माल ढुलाई में घंटों की देरी होती है। टायर पंचर वैक्सीन 4 मिमी तक के पंचर को तुरंत सील कर देता है और टायर का तापमान संतुलित रखता है, जिससे ईंधन की 5% तक बचत और टायर की लाइफ 20% तक बढ़ जाती है।",
                author="Technical Support Team",
                cover_image="/assets/why-choose-us.png",
                reading_time="4 min read",
                is_published=True
            ),
            BlogPost(
                title_en="Understanding Tyre Dosage: Getting the Right Sealant Volume for Your Vehicle",
                title_hi="टायर डोसेज को समझें: अपनी गाड़ी के लिए सही मात्रा कैसे चुनें",
                slug="understanding-tyre-dosage-guide",
                summary_en="A practical guide on how to calculate required sealant ml based on tyre size, profile, and wheel diameter.",
                summary_hi="टायर साइज, प्रोफाइल और रिम व्यास के अनुसार सही सीलेंट मात्रा की गणना करने की सरल गाइड।",
                content_en="Correct dosage ensures even centrifugal distribution across the internal tread. Two-wheelers require 400ml per wheel, while hatchbacks and sedans typically require 400ml per wheel (R12 to R17). For large SUVs and heavy commercial trucks, volumes scale up to 2.8 Litres for R22.5 tyres. Using our interactive dosage guide ensures your tyres receive optimal coverage.",
                content_hi="सही डोसेज से टायर के अंदर पूरी परिधि पर सीलेंट की एक समान परत बनती है। बाइक के लिए 400 मिली, कार के लिए 400 मिली और भारी ट्रकों के लिए 2.4 से 2.8 लीटर तक की आवश्यकता होती है।",
                author="Senior Project Architect",
                cover_image="/assets/installation-guidelines.jpeg",
                reading_time="3 min read",
                is_published=True
            )
        ]
        db.add_all(posts)
        print("Blog posts seeded")

    # 7. Events & News
    if db.query(EventNews).count() == 0:
        events = [
            EventNews(
                title_en="Expansion of Distributorship Network across Rajasthan",
                title_hi="पूरे राजस्थान में डिस्ट्रीब्यूटरशिप नेटवर्क का विस्तार",
                slug="rajasthan-distributor-expansion-2026",
                category="Launch",
                event_date="November 2026",
                excerpt_en="Ujjala Electricals announces dedicated tehsil and district partner appointments across Bikaner, Jaipur, Jodhpur, and Udaipur divisions.",
                excerpt_hi="उजाला इलेक्ट्रिकल्स द्वारा बीकानेर, जयपुर, जोधपुर और उदयपुर संभागों में तहसील व जिला वितरकों की नियुक्ति की घोषणा।",
                content_en="Following successful field trials and strong demand from fleet operators, Ujjala Electricals is expanding distributor appointments across all districts of Rajasthan. Partners receive comprehensive technical training, point-of-sale materials, and marketing support.",
                content_hi="उजाला इलेक्ट्रिकल्स राजस्थान के सभी जिलों में अधिकृत वितरकों का विस्तार कर रहा है। सभी भागीदारों को तकनीकी प्रशिक्षण और मार्केटिंग सामग्री उपलब्ध कराई जाएगी।",
                image_url="/assets/distributor-poster-1.jpeg",
                is_published=True
            ),
            EventNews(
                title_en="Tyre Safety & Preventive Sealant Demonstration Camp",
                title_hi="टायर सुरक्षा एवं प्रिवेंटिव सीलेंट डेमो कैंप",
                slug="tyre-safety-demonstration-camp",
                category="Camp",
                event_date="October 2026",
                excerpt_en="Live puncture testing on nail beds showing instantaneous sealing in front of local workshop owners and vehicle operators in Rani Bazar.",
                excerpt_hi="रानी बाज़ार में वर्कशॉप संचालकों और वाहन स्वामियों के समक्ष कीलों पर चलाकर लाइव पंचर सीलिंग का सफल प्रदर्शन।",
                content_en="The demonstration camp showcased the real-world performance of Gulf, Rock, and Thor sealants. Vehicles fitted with the sealant traversed multiple 3mm-4mm steel spikes with zero pressure loss.",
                content_hi="कैंप के दौरान वाहनों को 3-4 मिमी की कीलों पर चलाकर दिखाया गया और टायरों में बिना किसी हवा के दबाव में कमी के तुरंत सीलिंग का लाइव प्रदर्शन हुआ।",
                image_url="/assets/how-to-use-6steps.png",
                is_published=True
            )
        ]
        db.add_all(events)
        print("Events and news seeded")

    # 8. Testimonials
    if db.query(Testimonial).count() == 0:
        testimonials = [
            Testimonial(
                customer_name="Rajendra Singh Rathore",
                customer_city="Bikaner",
                vehicle_model="Mahindra Scorpio Classic",
                review_en="Installed Tyre Puncture Vaccine Rock 6 months ago. Drove through rough desert roads and highway stretches without a single puncture delay. Highly recommended!",
                review_hi="मैंने 6 महीने पहले अपनी स्कॉर्पियो में रॉक सीलेंट डलवाया था। कच्ची और हाईवे की सड़कों पर बिना किसी पंचर की चिंता के सफर का आनंद मिल रहा है। बेहतरीन प्रोडक्ट!",
                rating=5,
                is_approved=True,
                is_featured=True
            ),
            Testimonial(
                customer_name="Mohammad Imran",
                customer_city="Jaipur",
                vehicle_model="Eicher 10.95 Commercial Truck",
                review_en="Thor formulation has genuinely saved our transport business thousands in highway repair charges. Not a single flat tyre on the Delhi-Jaipur highway since installation.",
                review_hi="थॉर सीलेंट से हमारी ट्रांसपोर्ट गाड़ियों का हाईवे पर पंचर का सारा झंझट खत्म हो गया। दिल्ली-जयपुर रूट पर समय और पैसा दोनों बच रहा है।",
                rating=5,
                is_approved=True,
                is_featured=True
            ),
            Testimonial(
                customer_name="Vikram Choudhary",
                customer_city="Jodhpur",
                vehicle_model="Bajaj Pulsar NS200",
                review_en="Gulf gives absolute peace of mind during long bike rides. 400ml per tyre is super easy to install with the injector syringe provided.",
                review_hi="लंबी बाइक यात्राओं के लिए गल्फ एकदम सही है। सिरिंज से इसे डालना बहुत आसान है और पंचर की कोई चिंता नहीं रहती।",
                rating=5,
                is_approved=True,
                is_featured=True
            )
        ]
        db.add_all(testimonials)
        print("Testimonials seeded")

    # 9. Appointed Dealers
    if db.query(Dealer).count() == 0:
        dealers = [
            Dealer(
                dealer_name="Ujjala Electricals Main Depot",
                contact_person="Sales Team",
                phone="+91 74130 59364",
                email="ujjalaelectricalsbkn@gmail.com",
                address="Ground Floor, Near S.B.B.J., Rani Bazar, Industrial Area",
                city="Bikaner",
                district="Bikaner",
                state="Rajasthan",
                pin_code="334001",
                is_active=True,
                sort_order=1
            )
        ]
        db.add_all(dealers)
        print("Initial dealer seeded")

    db.commit()
    print("Database seeding completed successfully.")

if __name__ == "__main__":
    from app.database.session import Base, engine, SessionLocal
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    try:
        seed_db(session)
    finally:
        session.close()

