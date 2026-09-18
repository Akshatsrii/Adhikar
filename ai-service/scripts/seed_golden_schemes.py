import sys
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.database import SessionLocal
from app.models import Scheme, EligibilityRule, SchemeChunk
from app.gemini import embed_text

def seed_schemes():
    db = SessionLocal()
    
    # 1. PM Kisan
    kisan = Scheme(
        slug="pm-kisan",
        name="Pradhan Mantri Kisan Samman Nidhi",
        department="Ministry of Agriculture",
        category="Agriculture",
        level="central",
        state=None,
        benefit="Rs. 6000 per year income support",
        description="Income support for landholding farmers.",
        source_url="https://pmkisan.gov.in/"
    )
    db.add(kisan)
    db.commit()
    
    db.add(EligibilityRule(scheme_id=kisan.id, field="occupation", operator="==", value="Farmer"))
    
    kisan_chunk = SchemeChunk(
        scheme_id=kisan.id,
        chunk_type="overview",
        content="Pradhan Mantri Kisan Samman Nidhi provides Rs. 6000 per year income support to all landholding farmers in India. It is a central sector scheme for agriculture.",
        embedding=embed_text("Pradhan Mantri Kisan Samman Nidhi provides Rs. 6000 per year income support to all landholding farmers in India. It is a central sector scheme for agriculture.", task_type="RETRIEVAL_DOCUMENT")
    )
    db.add(kisan_chunk)

    # 2. Ayushman Bharat
    ab = Scheme(
        slug="ayushman-bharat",
        name="Ayushman Bharat PMJAY",
        department="Ministry of Health",
        category="Health",
        level="central",
        state=None,
        benefit="Health insurance up to Rs. 5 Lakh",
        description="Health insurance scheme for poor families.",
        source_url="https://pmjay.gov.in/"
    )
    db.add(ab)
    db.commit()
    
    db.add(EligibilityRule(scheme_id=ab.id, field="income", operator="<=", value="100000"))
    
    ab_chunk = SchemeChunk(
        scheme_id=ab.id,
        chunk_type="overview",
        content="Ayushman Bharat Pradhan Mantri Jan Arogya Yojana provides health insurance up to Rs. 5 Lakh per family per year for secondary and tertiary care hospitalization to poor and vulnerable families.",
        embedding=embed_text("Ayushman Bharat Pradhan Mantri Jan Arogya Yojana provides health insurance up to Rs. 5 Lakh per family per year for secondary and tertiary care hospitalization to poor and vulnerable families.", task_type="RETRIEVAL_DOCUMENT")
    )
    db.add(ab_chunk)

    # 3. PM Svanidhi
    svanidhi = Scheme(
        slug="pm-svanidhi",
        name="PM SVANidhi",
        department="Ministry of Housing",
        category="Business",
        level="central",
        state=None,
        benefit="Working capital loan up to Rs. 10000",
        description="Micro-credit facility for street vendors.",
        source_url="https://pmsvanidhi.mohua.gov.in/"
    )
    db.add(svanidhi)
    db.commit()
    
    db.add(EligibilityRule(scheme_id=svanidhi.id, field="occupation", operator="==", value="Street Vendor"))
    
    svanidhi_chunk = SchemeChunk(
        scheme_id=svanidhi.id,
        chunk_type="overview",
        content="PM SVANidhi is a special micro-credit facility for street vendors to access affordable working capital loans up to Rs. 10000 to resume their livelihoods after the COVID-19 lockdown.",
        embedding=embed_text("PM SVANidhi is a special micro-credit facility for street vendors to access affordable working capital loans up to Rs. 10000 to resume their livelihoods after the COVID-19 lockdown.", task_type="RETRIEVAL_DOCUMENT")
    )
    db.add(svanidhi_chunk)

    # 4. PM Awas Yojana
    awas = Scheme(
        slug="pm-awas-yojana",
        name="PM Awas Yojana",
        department="Ministry of Housing",
        category="Housing",
        level="central",
        state=None,
        benefit="Financial assistance for pukka house",
        description="Housing for All scheme.",
        source_url="https://pmaymis.gov.in/"
    )
    db.add(awas)
    db.commit()
    
    db.add(EligibilityRule(scheme_id=awas.id, field="income", operator="<=", value="300000"))
    
    awas_chunk = SchemeChunk(
        scheme_id=awas.id,
        chunk_type="overview",
        content="Pradhan Mantri Awas Yojana provides financial assistance to poor families to build a pukka house with basic amenities.",
        embedding=embed_text("Pradhan Mantri Awas Yojana provides financial assistance to poor families to build a pukka house with basic amenities.", task_type="RETRIEVAL_DOCUMENT")
    )
    db.add(awas_chunk)

    # 5. Atal Pension Yojana
    atal = Scheme(
        slug="atal-pension-yojana",
        name="Atal Pension Yojana",
        department="Ministry of Finance",
        category="Pension",
        level="central",
        state=None,
        benefit="Minimum guaranteed pension of Rs 1000 to 5000",
        description="Pension scheme for unorganized sector.",
        source_url="https://npscra.nsdl.co.in/scheme-details.php"
    )
    db.add(atal)
    db.commit()
    
    db.add(EligibilityRule(scheme_id=atal.id, field="age", operator=">=", value="18"))
    db.add(EligibilityRule(scheme_id=atal.id, field="age", operator="<=", value="40"))
    
    atal_chunk = SchemeChunk(
        scheme_id=atal.id,
        chunk_type="overview",
        content="Atal Pension Yojana is a pension scheme for unorganized sector workers offering a minimum guaranteed pension of Rs 1000 to 5000 per month after age 60.",
        embedding=embed_text("Atal Pension Yojana is a pension scheme for unorganized sector workers offering a minimum guaranteed pension of Rs 1000 to 5000 per month after age 60.", task_type="RETRIEVAL_DOCUMENT")
    )
    db.add(atal_chunk)

    db.commit()
    db.close()
    print("Database seeded with golden schemes.")

if __name__ == "__main__":
    seed_schemes()
