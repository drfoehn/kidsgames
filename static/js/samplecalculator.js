/* document.addEventListener('DOMContentLoaded', function() {
   fetch('analytes.json')
   .then(response => response.json())
   .then(data => createTabsAndCheckboxes(data));
}); */

// When trying to fetch JSON data from another file, usually the "Same-Origin Policy" is being enforced by web browsers, 
// which prevents loading resources from different origins. analytes.json is then treated as a cross-origin request, which is blocked.
// If you do not have this problem it would be cleaner to fetch the data from a separate JSON file - Just use the code above for that.

const analytesData = [
    {
        "Test": "Anti Xa Heparin monitoring",
        "Tube": "Coagulation",
        "Remarks": "Exactly 4h after Lovenox administration! (Or with complete coagulation)",
        "Minimum Sample Volume": 10,
        "Required Dead Volume": null,
        "Group": "Coagulation"
    },
    {
        "Test": "AT III",
        "Tube": "Coagulation",
        "Remarks": null,
        "Minimum Sample Volume": 21,
        "Required Dead Volume": null,
        "Group": "Coagulation"
    },
    {
        "Test": "D-Dimer",
        "Tube": "Coagulation",
        "Remarks": null,
        "Minimum Sample Volume": 15,
        "Required Dead Volume": 100,
        "Group": "Coagulation"
    },
    {
        "Test": "Fibrinogen",
        "Tube": "Coagulation",
        "Remarks": null,
        "Minimum Sample Volume": 10,
        "Required Dead Volume": null,
        "Group": "Coagulation"
    },
    {
        "Test": "Coagulation factor XIII (13)",
        "Tube": "Coagulation",
        "Remarks": null,
        "Minimum Sample Volume": 20,
        "Required Dead Volume": 100,
        "Group": "Coagulation"
    },
    {
        "Test": "Coagulation factor VIII (8)",
        "Tube": "Coagulation",
        "Remarks": null,
        "Minimum Sample Volume": 15,
        "Required Dead Volume": 100,
        "Group": "Coagulation"
    },
    {
        "Test": "Coagulation factor IX (9)",
        "Tube": "Coagulation",
        "Remarks": null,
        "Minimum Sample Volume": 15,
        "Required Dead Volume": 100,
        "Group": "Coagulation"
    },
    {
        "Test": "Protein C",
        "Tube": "Coagulation",
        "Remarks": "Only Mon-Fri.",
        "Minimum Sample Volume": 15,
        "Required Dead Volume": 100,
        "Group": "Coagulation"
    },
    {
        "Test": "Protein S free",
        "Tube": "Coagulation",
        "Remarks": "Only Mon-Fri.",
        "Minimum Sample Volume": 21,
        "Required Dead Volume": 100,
        "Group": "Coagulation"
    },
    {
        "Test": "Protein S-Activity",
        "Tube": "Coagulation",
        "Remarks": "Determined only once a week, otherwise deep-frozen in ZL",
        "Minimum Sample Volume": 25,
        "Required Dead Volume": 100,
        "Group": "Coagulation"
    },
    {
        "Test": "aPTT",
        "Tube": "Coagulation",
        "Remarks": null,
        "Minimum Sample Volume": 50,
        "Required Dead Volume": 100,
        "Group": "Coagulation"
    },
    {
        "Test": "PT (incl. INR)",
        "Tube": "Coagulation",
        "Remarks": null,
        "Minimum Sample Volume": 50,
        "Required Dead Volume": 100,
        "Group": "Coagulation"
    },
    {
        "Test": "Leukocyte typing",
        "Tube": "EDTA",
        "Remarks": "Announce by phone incl. question",
        "Minimum Sample Volume": 526,
        "Required Dead Volume": 270,
        "Group": "Hematology"
    },
    {
        "Test": "Creatinine in urine",
        "Tube": "Urine tube",
        "Remarks": null,
        "Minimum Sample Volume": 2,
        "Required Dead Volume": 100,
        "Group": "Urinalysis"
    },
    {
        "Test": "Copper in 24h urine",
        "Tube": "Urine tube",
        "Remarks": "Indication of total urine volume collected in 24h with 1ml urine to ZL - No preservation (done once a week)",
        "Minimum Sample Volume": 50,
        "Required Dead Volume": 500,
        "Group": "Urinalysis"
    },
    {
        "Test": "Urine protein pattern (Albumin, Alpha1-microglobulin, Alpha2-macroglobulin, IgG and Creatinine in urine)",
        "Tube": "Urine tube",
        "Remarks": null,
        "Minimum Sample Volume": 323,
        "Required Dead Volume": 100,
        "Group": "Urinalysis"
    },
    {
        "Test": "Osmolarity in urine",
        "Tube": "Urine tube",
        "Remarks": "Outside routine hours, please use form Referral for measurement of osmolarity in serum/urine outside routine hours.",
        "Minimum Sample Volume": 200,
        "Required Dead Volume": 100,
        "Group": "Urinalysis"
    },
    {
        "Test": "Alpha-1 Antitrypsin",
        "Tube": "Heparin-Plasma",
        "Remarks": null,
        "Minimum Sample Volume": 9,
        "Required Dead Volume": 50,
        "Group": "Immunology"
    },
    {
        "Test": "Hepatitis B c-AB (IgM / IgG)",
        "Tube": "Serum",
        "Remarks": null,
        "Minimum Sample Volume": 300,
        "Required Dead Volume": 100,
        "Group": "Infectious Diseases"
    },
    {
        "Test": "Hepatitis B e-AB / AG",
        "Tube": "Serum",
        "Remarks": null,
        "Minimum Sample Volume": 300,
        "Required Dead Volume": 100,
        "Group": "Infectious Diseases"
    },
    {
        "Test": "Hepatitis B s-Antigen",
        "Tube": "Serum",
        "Remarks": null,
        "Minimum Sample Volume": 200,
        "Required Dead Volume": 100,
        "Group": "Infectious Diseases"
    },
    {
        "Test": "Hepatitis B s-Antibody",
        "Tube": "Serum",
        "Remarks": null,
        "Minimum Sample Volume": 150,
        "Required Dead Volume": 100,
        "Group": "Infectious Diseases"
    },
    {
        "Test": "Hepatitis A-IgG / IgM",
        "Tube": "Serum",
        "Remarks": null,
        "Minimum Sample Volume": 150,
        "Required Dead Volume": 100,
        "Group": "Infectious Diseases"
    },
    {
        "Test": "Hepatitis C-AB IgG/IgM",
        "Tube": "Serum",
        "Remarks": null,
        "Minimum Sample Volume": 150,
        "Required Dead Volume": 100,
        "Group": "Infectious Diseases"
    },
    {
        "Test": "Hepatitis Serology",
        "Tube": "Serum",
        "Remarks": "V- Doctors usual US \u2192 Signature 1x full serum tube",
        "Minimum Sample Volume": 1500,
        "Required Dead Volume": 100,
        "Group": "Infectious Diseases"
    },
    {
        "Test": "HIV-AB",
        "Tube": "Serum",
        "Remarks": null,
        "Minimum Sample Volume": 150,
        "Required Dead Volume": 100,
        "Group": "Infectious Diseases"
    },
    {
        "Test": "Toxoplasmosis AB (IgG +IgM)",
        "Tube": "Serum",
        "Remarks": null,
        "Minimum Sample Volume": 300,
        "Required Dead Volume": 100,
        "Group": "Infectious Diseases"
    },
    {
        "Test": "Ammonia (= NH\u00b3)",
        "Tube": "EDTA",
        "Remarks": "Place on ice IMMEDIATELY and send",
        "Minimum Sample Volume": 17,
        "Required Dead Volume": 50,
        "Group": "Clinical Chemistry"
    },
    {
        "Test": "Albumin in serum",
        "Tube": "Heparin-Plasma",
        "Remarks": null,
        "Minimum Sample Volume": 2,
        "Required Dead Volume": 50,
        "Group": "Clinical Chemistry"
    },
    {
        "Test": "Aldolase",
        "Tube": "Heparin-Plasma",
        "Remarks": null,
        "Minimum Sample Volume": 400,
        "Required Dead Volume": 0,
        "Group": "Clinical Chemistry"
    },
    {
        "Test": "Alkaline Phosphatase",
        "Tube": "Heparin-Plasma",
        "Remarks": null,
        "Minimum Sample Volume": 2.8,
        "Required Dead Volume": 50,
        "Group": "Clinical Chemistry"
    },
    {
        "Test": "Alcohol level",
        "Tube": "Heparin-Plasma",
        "Remarks": null,
        "Minimum Sample Volume": 4,
        "Required Dead Volume": 50,
        "Group": "Clinical Chemistry"
    },
    {
        "Test": "Amylase in blood",
        "Tube": "Heparin-Plasma",
        "Remarks": null,
        "Minimum Sample Volume": 4,
        "Required Dead Volume": 50,
        "Group": "Clinical Chemistry"
    },
    {
        "Test": "ASL-Antistreptolysin- Titer",
        "Tube": "Heparin-Plasma",
        "Remarks": null,
        "Minimum Sample Volume": 2,
        "Required Dead Volume": 100,
        "Group": "Clinical Chemistry"
    },
    {
        "Test": "Bilirubin direct",
        "Tube": "Heparin-Plasma",
        "Remarks": "Light protection of the tube would be optimal",
        "Minimum Sample Volume": 6.7,
        "Required Dead Volume": 50,
        "Group": "Clinical Chemistry"
    },
    {
        "Test": "Bilirubin total",
        "Tube": "Heparin-Plasma",
        "Remarks": "Light protection of the tube would be optimal",
        "Minimum Sample Volume": 2,
        "Required Dead Volume": 50,
        "Group": "Clinical Chemistry"
    },
    {
        "Test": "Caeruloplasmin",
        "Tube": "Heparin-Plasma",
        "Remarks": null,
        "Minimum Sample Volume": 15,
        "Required Dead Volume": 100,
        "Group": "Clinical Chemistry"
    },
    {
        "Test": "Cholesterol",
        "Tube": "Heparin-Plasma",
        "Remarks": null,
        "Minimum Sample Volume": 2,
        "Required Dead Volume": 100,
        "Group": "Clinical Chemistry"
    },
    {
        "Test": "Cholinesterase",
        "Tube": "Heparin-Plasma",
        "Remarks": null,
        "Minimum Sample Volume": 2,
        "Required Dead Volume": 100,
        "Group": "Clinical Chemistry"
    },
    {
        "Test": "CPK = CK",
        "Tube": "Heparin-Plasma",
        "Remarks": null,
        "Minimum Sample Volume": 2.8,
        "Required Dead Volume": 100,
        "Group": "Clinical Chemistry"
    },
    {
        "Test": "CRP",
        "Tube": "Heparin-Plasma",
        "Remarks": null,
        "Minimum Sample Volume": 2,
        "Required Dead Volume": 100,
        "Group": "Clinical Chemistry"
    },
    {
        "Test": "Cystatin C",
        "Tube": "Heparin-Plasma",
        "Remarks": "Only Mon. - Fri. Not possible in urine",
        "Minimum Sample Volume": 2,
        "Required Dead Volume": 100,
        "Group": "Clinical Chemistry"
    },
    {
        "Test": "Serum-Iron",
        "Tube": "Heparin-Plasma",
        "Remarks": null,
        "Minimum Sample Volume": 8.5,
        "Required Dead Volume": 100,
        "Group": "Clinical Chemistry"
    },
    {
        "Test": "Transferrin saturation",
        "Tube": "Calculated",
        "Remarks": "Calculated analysis (request serum iron and transferrin)",
        "Minimum Sample Volume": 0,
        "Required Dead Volume": 0,
        "Group": "Clinical Chemistry"
    },
    {
        "Test": "Ferritin",
        "Tube": "Heparin-Plasma",
        "Remarks": null,
        "Minimum Sample Volume": 10,
        "Required Dead Volume": 100,
        "Group": "Clinical Chemistry"
    },
    {
        "Test": "Transferrin",
        "Tube": "Heparin-Plasma",
        "Remarks": null,
        "Minimum Sample Volume": 9,
        "Required Dead Volume": 100,
        "Group": "Clinical Chemistry"
    },
    {
        "Test": "Free Hemoglobin",
        "Tube": "Heparin-Plasma",
        "Remarks": "also possible from EDTA-plasma",
        "Minimum Sample Volume": 2,
        "Required Dead Volume": 100,
        "Group": "Clinical Chemistry"
    },
    {
        "Test": "Haptoglobin",
        "Tube": "Heparin-Plasma",
        "Remarks": null,
        "Minimum Sample Volume": 9,
        "Required Dead Volume": 100,
        "Group": "Clinical Chemistry"
    },
    {
        "Test": "ACE - Angiotensin converting enzyme",
        "Tube": "Serum",
        "Remarks": null,
        "Minimum Sample Volume": 18,
        "Required Dead Volume": 50,
        "Group": "Clinical Chemistry"
    },
    {
        "Test": "Alpha 1-Fetoprotein (AFP)",
        "Tube": "Serum",
        "Remarks": null,
        "Minimum Sample Volume": 6,
        "Required Dead Volume": 50,
        "Group": "Clinical Chemistry"
    },
    {
        "Test": "Uric acid",
        "Tube": "Heparin-Plasma",
        "Remarks": null,
        "Minimum Sample Volume": 3,
        "Required Dead Volume": 100,
        "Group": "Clinical Chemistry"
    },
    {
        "Test": "Homocysteine",
        "Tube": "EDTA",
        "Remarks": "No vitamin intake in the last 3d: Immediately cooled to ZL",
        "Minimum Sample Volume": 20,
        "Required Dead Volume": 150,
        "Group": "Clinical Chemistry"
    },
    {
        "Test": "Interleukin 6 (Venous or umbilical cord blood)",
        "Tube": "Heparin-Plasma",
        "Remarks": "For umbilical cord blood, check IL6 Cordal blood",
        "Minimum Sample Volume": 18,
        "Required Dead Volume": 100,
        "Group": "Clinical Chemistry"
    },
    {
        "Test": "Creatinine (+eGFR) in blood",
        "Tube": "Heparin-Plasma",
        "Remarks": null,
        "Minimum Sample Volume": 3,
        "Required Dead Volume": 100,
        "Group": "Clinical Chemistry"
    },
    {
        "Test": "Lactate in blood (Fluoride tube)",
        "Tube": "Fluoride tube",
        "Remarks": null,
        "Minimum Sample Volume": 2,
        "Required Dead Volume": 100,
        "Group": "Clinical Chemistry"
    },
    {
        "Test": "LDH",
        "Tube": "Heparin-Plasma",
        "Remarks": null,
        "Minimum Sample Volume": 2.8,
        "Required Dead Volume": 100,
        "Group": "Clinical Chemistry"
    },
    {
        "Test": "GOT",
        "Tube": "Heparin-Plasma",
        "Remarks": null,
        "Minimum Sample Volume": 9,
        "Required Dead Volume": 100,
        "Group": "Clinical Chemistry"
    },
    {
        "Test": "GPT",
        "Tube": "Heparin-Plasma",
        "Remarks": null,
        "Minimum Sample Volume": 9,
        "Required Dead Volume": 100,
        "Group": "Clinical Chemistry"
    },
    {
        "Test": "Gamma-GT",
        "Tube": "Heparin-Plasma",
        "Remarks": null,
        "Minimum Sample Volume": 3,
        "Required Dead Volume": 100,
        "Group": "Clinical Chemistry"
    },
    {
        "Test": "Alkaline Phosphatase",
        "Tube": "Heparin-Plasma",
        "Remarks": null,
        "Minimum Sample Volume": 3,
        "Required Dead Volume": 100,
        "Group": "Clinical Chemistry"
    },
    {
        "Test": "Lipoprotein(a)",
        "Tube": "Heparin-Plasma",
        "Remarks": null,
        "Minimum Sample Volume": 2,
        "Required Dead Volume": 100,
        "Group": "Clinical Chemistry"
    },
    {
        "Test": "Myoglobin",
        "Tube": "Heparin-Plasma",
        "Remarks": "Or together with other parameters",
        "Minimum Sample Volume": 9,
        "Required Dead Volume": 100,
        "Group": "Clinical Chemistry"
    },
    {
        "Test": "NSE (neurospecific enolase)",
        "Tube": "Serum",
        "Remarks": null,
        "Minimum Sample Volume": 12,
        "Required Dead Volume": 100,
        "Group": "Clinical Chemistry"
    },
    {
        "Test": "S100",
        "Tube": "Serum",
        "Remarks": null,
        "Minimum Sample Volume": 12,
        "Required Dead Volume": 100,
        "Group": "Clinical Chemistry"
    },
    {
        "Test": "NT-proBNP",
        "Tube": "Heparin-Plasma",
        "Remarks": null,
        "Minimum Sample Volume": 9,
        "Required Dead Volume": 100,
        "Group": "Clinical Chemistry"
    },
    {
        "Test": "Procalcitonin (PCT)",
        "Tube": "Heparin-Plasma",
        "Remarks": null,
        "Minimum Sample Volume": 18,
        "Required Dead Volume": 100,
        "Group": "Clinical Chemistry"
    },
    {
        "Test": "Rheumatoid factor",
        "Tube": "Heparin-Plasma",
        "Remarks": null,
        "Minimum Sample Volume": 3,
        "Required Dead Volume": 100,
        "Group": "Clinical Chemistry"
    },
    {
        "Test": "Osmolarity in serum ",
        "Tube": "Serum",
        "Remarks": "Outside routine hours, please use form Referral for measurement of osmolarity in serum/urine outside routine hours.",
        "Minimum Sample Volume": 200,
        "Required Dead Volume": 100,
        "Group": "Clinical Chemistry"
    },
    {
        "Test": "Transferrin Receptor soluble",
        "Tube": "Heparin-Plasma",
        "Remarks": null,
        "Minimum Sample Volume": 2,
        "Required Dead Volume": 100,
        "Group": "Clinical Chemistry"
    },
    {
        "Test": "Triglycerides",
        "Tube": "Heparin-Plasma",
        "Remarks": null,
        "Minimum Sample Volume": 2,
        "Required Dead Volume": 100,
        "Group": "Clinical Chemistry"
    },
    {
        "Test": "Troponin hs",
        "Tube": "Heparin-Plasma",
        "Remarks": null,
        "Minimum Sample Volume": 30,
        "Required Dead Volume": 100,
        "Group": "Clinical Chemistry"
    },
    {
        "Test": "CMV PCR in CSF",
        "Tube": "CSF tube",
        "Remarks": null,
        "Minimum Sample Volume": 500,
        "Required Dead Volume": 100,
        "Group": "CSF analyses"
    },
    {
        "Test": "Covid PCR in Blood",
        "Tube": "EDTA",
        "Remarks": null,
        "Minimum Sample Volume": 1000,
        "Required Dead Volume": 100,
        "Group": "Molecular Biology"
    },
    {
        "Test": "CMV PCR in blood",
        "Tube": "EDTA ",
        "Remarks": null,
        "Minimum Sample Volume": 500,
        "Required Dead Volume": 100,
        "Group": "Molecular Biology"
    },
    {
        "Test": "CMV PCR in urine",
        "Tube": "Urine tube ",
        "Remarks": null,
        "Minimum Sample Volume": 500,
        "Required Dead Volume": 100,
        "Group": "Molecular Biology"
    },
    {
        "Test": "HBV DNA / HBV-PCR > quantitative",
        "Tube": "Serum",
        "Remarks": null,
        "Minimum Sample Volume": 300,
        "Required Dead Volume": 100,
        "Group": "Molecular Biology"
    },
    {
        "Test": "HCV RNA / HCV-PCR > quantitative",
        "Tube": "Serum",
        "Remarks": null,
        "Minimum Sample Volume": 600,
        "Required Dead Volume": 100,
        "Group": "Molecular Biology"
    },
    {
        "Test": "HIV RNA / HIV-PCR",
        "Tube": "EDTA",
        "Remarks": null,
        "Minimum Sample Volume": 600,
        "Required Dead Volume": 100,
        "Group": "Molecular Biology"
    },
    {
        "Test": "RSV PCR",
        "Tube": "Nasal, throat or tracheal secretion",
        "Remarks": null,
        "Minimum Sample Volume": null,
        "Required Dead Volume": null,
        "Group": "Molecular Biology"
    },
    {
        "Test": "UGT1A1-Polymorphism",
        "Tube": "EDTA",
        "Remarks": "Genetic reverse needed, Result takes about 1 week",
        "Minimum Sample Volume": 200,
        "Required Dead Volume": 100,
        "Group": "Molecular Biology"
    },
    {
        "Test": "Electrolytes (Na, K, Cl, Ca, P, Mg) in 24h urine",
        "Tube": "Urine tube",
        "Remarks": "Na/K/Cl: 10-15 / Ca: 2 / Phosphorus: 15 / Magnesium: 14 Include urine collection volume/24h\"",
        "Minimum Sample Volume": 50,
        "Required Dead Volume": 100,
        "Group": "Panels"
    },
    {
        "Test": "Electrolytes (Na, K, Cl, Ca, P, Mg) in spot urine",
        "Tube": "Urine tube",
        "Remarks": "Na/K/Cl: 10-15 / Ca: 2 / Phosphorus: 15 / Magnesium: 14",
        "Minimum Sample Volume": 50,
        "Required Dead Volume": 100,
        "Group": "Panels"
    },
    {
        "Test": "C3 Complement",
        "Tube": "Heparin-Plasma",
        "Remarks": null,
        "Minimum Sample Volume": 9,
        "Required Dead Volume": 50,
        "Group": "Proteindiagnostics"
    },
    {
        "Test": "C4 Complement",
        "Tube": "Heparin-Plasma",
        "Remarks": null,
        "Minimum Sample Volume": 15,
        "Required Dead Volume": 50,
        "Group": "Proteindiagnostics"
    },
    {
        "Test": "Beta-2-Microglobulin in blood",
        "Tube": "Serum",
        "Remarks": "No 24h urine collection needed",
        "Minimum Sample Volume": 50,
        "Required Dead Volume": 100,
        "Group": "Proteindiagnostics"
    },
    {
        "Test": "Serum-Electrophoresis",
        "Tube": "Serum",
        "Remarks": null,
        "Minimum Sample Volume": 10,
        "Required Dead Volume": 150,
        "Group": "Proteindiagnostics"
    },
    {
        "Test": "Albumin / Creatinine - Ratio",
        "Tube": "Calculated",
        "Remarks": "Calculated analysis (request albumin and creatinine in urine)",
        "Minimum Sample Volume": 0,
        "Required Dead Volume": 0,
        "Group": "Proteindiagnostics"
    },
    {
        "Test": "Protein / Creatinine - Ratio",
        "Tube": "Calculated",
        "Remarks": "Calculated analysis (request protein and creatinine in urine)",
        "Minimum Sample Volume": 0,
        "Required Dead Volume": 0,
        "Group": "Proteindiagnostics"
    },
    {
        "Test": "Immunoglobulins IgM, IgA, IgG,",
        "Tube": "Serum",
        "Remarks": null,
        "Minimum Sample Volume": 200,
        "Required Dead Volume": "\"100 \"",
        "Group": "Proteindiagnostics"
    },
    {
        "Test": "Immunoglobulin IgE",
        "Tube": "Serum",
        "Remarks": null,
        "Minimum Sample Volume": 50,
        "Required Dead Volume": 100,
        "Group": "Proteindiagnostics"
    },
    {
        "Test": "Copper in plasma",
        "Tube": "Heparin-Plasma",
        "Remarks": null,
        "Minimum Sample Volume": 50,
        "Required Dead Volume": 100,
        "Group": "Special Tests"
    },
    {
        "Test": "Zinc in plasma",
        "Tube": "Heparin-Plasma",
        "Remarks": "Done once a week",
        "Minimum Sample Volume": 50,
        "Required Dead Volume": 100,
        "Group": "Special Tests"
    },
    {
        "Test": "Elastase in stool (Pancreatic elastase)",
        "Tube": "Stool tube",
        "Remarks": null,
        "Minimum Sample Volume": "1g",
        "Required Dead Volume": "1.5g",
        "Group": "Special Tests"
    },
    {
        "Test": "Insulin Determination",
        "Tube": "Heparin-Plasma?",
        "Remarks": "Fasting! send immediately NOT at night/weekend",
        "Minimum Sample Volume": 90,
        "Required Dead Volume": 50,
        "Group": "Special Tests"
    },
    {
        "Test": "Lamictal Level (Lamotrigine)",
        "Tube": "Serum",
        "Remarks": null,
        "Minimum Sample Volume": 100,
        "Required Dead Volume": 150,
        "Group": "Toxicology"
    },
    {
        "Test": "Caffeine Level from Heparin-Plasma",
        "Tube": "Heparin-Plasma",
        "Remarks": "\"Single determination: Serum With other parameters: together in Heparin-Plasma\"",
        "Minimum Sample Volume": 2,
        "Required Dead Volume": 100,
        "Group": "Toxicology"
    },
    {
        "Test": "Alprazolam level",
        "Tube": "Serum",
        "Remarks": null,
        "Minimum Sample Volume": 100,
        "Required Dead Volume": 150,
        "Group": "Toxicology"
    },
    {
        "Test": "CDG Screening",
        "Tube": "Serum",
        "Remarks": null,
        "Minimum Sample Volume": 100,
        "Required Dead Volume": 150,
        "Group": "Toxicology"
    },
    {
        "Test": "Clozapine Level",
        "Tube": "Serum",
        "Remarks": null,
        "Minimum Sample Volume": 100,
        "Required Dead Volume": 150,
        "Group": "Toxicology"
    },
    {
        "Test": "Bile acid",
        "Tube": "Serum (Light protected!!)",
        "Remarks": "Sample is only examined on Thursdays!",
        "Minimum Sample Volume": 150,
        "Required Dead Volume": 50,
        "Group": "Toxicology"
    },
    {
        "Test": "Drug detection in meconium",
        "Tube": "Stool tube",
        "Remarks": "Preferably on 1st LT and first meconium",
        "Minimum Sample Volume": "1g",
        "Required Dead Volume": "1.5g",
        "Group": "Toxicology"
    },
    {
        "Test": "Keppra level (Levetiracetam)",
        "Tube": "Serum",
        "Remarks": "Only Monday and Wednesday! Collect before 10 am",
        "Minimum Sample Volume": 100,
        "Required Dead Volume": 150,
        "Group": "Toxicology"
    },
    {
        "Test": "Refobacin (Gentamycin)",
        "Tube": "Serum",
        "Remarks": null,
        "Minimum Sample Volume": 2,
        "Required Dead Volume": 100,
        "Group": "Toxicology"
    },
    {
        "Test": "Tacrolimus level",
        "Tube": "EDTA",
        "Remarks": null,
        "Minimum Sample Volume": 400,
        "Required Dead Volume": 100,
        "Group": "Toxicology"
    },
    {
        "Test": "Targocid-Level (Teicoplanin)",
        "Tube": "Serum",
        "Remarks": "\"Trough level Determination daily during routine times, on holidays and weekends until 12:00h\"",
        "Minimum Sample Volume": 150,
        "Required Dead Volume": 50,
        "Group": "Toxicology"
    },
    {
        "Test": "Theospirex-Level (Theophylline)",
        "Tube": "Serum",
        "Remarks": "Trough level. Note on chart if peak level",
        "Minimum Sample Volume": 2,
        "Required Dead Volume": 100,
        "Group": "Toxicology"
    },
    {
        "Test": "Topamax level = Topiramate level",
        "Tube": "Serum",
        "Remarks": "\"Only determined once per week \u2192 Thursday If sent earlier, sample will be frozen in lab\"",
        "Minimum Sample Volume": 150,
        "Required Dead Volume": 50,
        "Group": "Toxicology"
    },
    {
        "Test": "Valproic acid (Depakene)",
        "Tube": "Serum",
        "Remarks": "Under Anticonvulsants",
        "Minimum Sample Volume": 2,
        "Required Dead Volume": 100,
        "Group": "Toxicology"
    },
    {
        "Test": "Vitamin A + E",
        "Tube": "Serum",
        "Remarks": null,
        "Minimum Sample Volume": 200,
        "Required Dead Volume": 550,
        "Group": "Toxicology"
    },
    {
        "Test": "Vitamin B12",
        "Tube": "Serum",
        "Remarks": null,
        "Minimum Sample Volume": 100,
        "Required Dead Volume": 50,
        "Group": "Toxicology"
    },
    {
        "Test": "Vitamin B1-B6",
        "Tube": "EDTA",
        "Remarks": null,
        "Minimum Sample Volume": 200,
        "Required Dead Volume": 300,
        "Group": "Toxicology"
    },
    {
        "Test": "Zyvoxid level (Linezolid)",
        "Tube": "Serum",
        "Remarks": "\"Only Tue and Thu, must be in lab before 07.00 am\"",
        "Minimum Sample Volume": 100,
        "Required Dead Volume": 150,
        "Group": "Toxicology"
    },
    {
        "Test": "Digoxin-Level",
        "Tube": "Heparin-Plasma",
        "Remarks": "Collection 12 hrs after last dose, note on form",
        "Minimum Sample Volume": 6,
        "Required Dead Volume": 100,
        "Group": "Toxicology"
    }
];

function searchAnalytes() {
    const searchTerm = document.getElementById('searchInput').value;
    if (!searchTerm) {
        alert("Please enter a search term.");
        return;
    }

    const filteredData = analytesData.filter(item => 
        item.Test.toLowerCase().includes(searchTerm.toLowerCase())
    );
    console.log("Filtered Data:", filteredData);

    // Clear existing search results
    const existingSearchTab = document.getElementById('SearchResults');
    if (existingSearchTab) {
        existingSearchTab.remove();
    }

    // Add a new tab for search results
    const tabContainer = document.querySelector('.tab');
    const tabContent = document.getElementById('tabContent');

    const searchTab = document.createElement('div');
    searchTab.id = 'SearchResults';
    searchTab.className = 'tabcontent';

    filteredData.forEach(test => {
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = test.Test;
        checkbox.name = test.Test;
        checkbox.addEventListener('change', function() {
            updateSelectedAnalytes(test, this.checked);
            updateTubeSelections();
        });

        let label = document.createElement('label');
        label.htmlFor = test.Test;
        label.textContent = test.Test;

        searchTab.appendChild(checkbox);
        searchTab.appendChild(label);
        searchTab.appendChild(document.createElement('br'));
    });

    tabContent.appendChild(searchTab);

    // Create or update the button for search results
    let searchTabButton = document.getElementById('searchTabButton');
    if (!searchTabButton) {
        searchTabButton = document.createElement('button');
        searchTabButton.id = 'searchTabButton';
        searchTabButton.className = 'tablinks';
        searchTabButton.addEventListener('click', function(event) {
            openTab(event, 'SearchResults');
        });
        tabContainer.appendChild(searchTabButton);
    }

    // Set button text to "Search: [Search Term]"
    searchTabButton.textContent = 'Search: ' + searchTerm;

    // Automatically open the search results tab
    openTab(null, 'SearchResults');
}

function createTabsAndCheckboxes(analytesData) {
    let groups = {};

    // Group data by 'Group'
    analytesData.forEach(item => {
        if (!groups[item.Group]) {
            groups[item.Group] = [];
        }
        groups[item.Group].push(item);
    });

    // Create tabs
    const tabContainer = document.querySelector('.tab');
    const tabContent = document.getElementById('tabContent');

    for (let group in groups) {
        let btn = document.createElement('button');
        btn.textContent = group;
        btn.className = 'tablinks';
        btn.addEventListener('click', function(event) {
            openTab(event, group);
        });
        tabContainer.appendChild(btn);

        let tabDiv = document.createElement('div');
        tabDiv.id = group;
        tabDiv.className = 'tabcontent';

        groups[group].forEach(test => {
            let checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = test.Test;
            checkbox.name = test.Test;
            checkbox.addEventListener('change', function() {
                updateSelectedAnalytes(test, this.checked);
                updateTubeSelections();
            });

            let label = document.createElement('label');
            label.htmlFor = test.Test;
            label.textContent = test.Test;

            tabDiv.appendChild(checkbox);
            tabDiv.appendChild(label);
            tabDiv.appendChild(document.createElement('br'));
        });

        tabContent.appendChild(tabDiv);
    }
}

function updateSelectedAnalytes(test, isChecked) {
    const tableBody = document.querySelector('#selectedAnalytesTable tbody');
    if (isChecked) {
        let row = tableBody.insertRow();
        row.id = 'row-' + test.Test;
        Object.keys(test).forEach(key => {
            let cell = row.insertCell();
            cell.textContent = test[key];
        });
        // Remove the conditional background coloring
    } else {
        let rowToRemove = document.getElementById('row-' + test.Test);
        if (rowToRemove) {
            tableBody.removeChild(rowToRemove);
        }
    }
}



function updateTubeSelections() {
    const tubeContainer = document.getElementById('tubeContainer');
    tubeContainer.innerHTML = ''; // Clear previous content

    const selectedRows = document.querySelectorAll('#selectedAnalytesTable tbody tr');
    let tubeTypes = new Set();

    // Find unique tube types from selected rows
    selectedRows.forEach(row => {
        if (!row.classList.contains("not-calculable")) {
            tubeTypes.add(row.cells[1].textContent); // Tube is at index 3
        }
    });

    tubeTypes.forEach(type => {
        let div = document.createElement('div');
        div.className = 'input-group mb-3';
        div.style = 'width: 500px;';
        div.id = 'volume-selection';
        div.innerHTML = `
            <label class="input-group-text" for="fillingVolume${type}">${type} Filling Volume:</label>
            <select class="form-select" id="fillingVolume${type}">
                <option selected>Select...</option>
                <option value="500">500</option>
                <option value="800">800</option>
                <option value="1200">1200</option>
            </select>
            <span class="input-group-text">μl</span>`;
        tubeContainer.appendChild(div);
    });
}

function calculateForTubeType(type, fillingVolume, rows) {
    // Initialize variables for sample volume calculations
    let totalSampleVolume = 0;
    let highestDeadVolume = 0;

    // Determine the tube type
    let isHeparinOrSerum = type.toLowerCase().includes('heparin') || type.toLowerCase().includes('serum');
    let isCoagulation = type.toLowerCase() === 'coagulation';
    let isCSFAnalyses = type.toLowerCase() === 'csf analyses' || type.toLowerCase() === 'csf tube';

    // Calculate total sample volume and find the highest dead volume
    rows.forEach(row => {
        if (row.cells[1].textContent === type) {
            const sampleVolume = parseFloat(row.cells[3].textContent) || 0;
            const deadVolume = parseFloat(row.cells[4].textContent) || 0;

            totalSampleVolume += sampleVolume;
            if (deadVolume > highestDeadVolume) {
                highestDeadVolume = deadVolume;
            }
        }
    });

    // Initialize variables for volume calculations
    let totalVolume;
    let requiredSampleVolume;
    let hctValue = parseFloat(document.getElementById('hct').value) / 100;

    // Calculate required sample volume based on tube type
    if (isHeparinOrSerum || isCoagulation) {
        // For Heparin, Serum, and Coagulation: consider the hematocrit value
        requiredSampleVolume = totalSampleVolume + highestDeadVolume;
        totalVolume = requiredSampleVolume / (1 - hctValue);
    } else {
        // For all other tube types: don't consider hematocrit
        requiredSampleVolume = totalSampleVolume + highestDeadVolume;
        totalVolume = requiredSampleVolume;
    }

    // Add safety margin of 250µl, except for CSF analyses
    let safetyMargin = isCSFAnalyses ? 0 : 250;
    totalVolume += safetyMargin;

    // Check if the total volume exceeds the filling volume (for non-CSF and non-Coagulation tubes)
    let warning = !isCSFAnalyses && !isCoagulation && totalVolume > fillingVolume;

    // Return an object with all calculated values and flags
    return {
        volume: totalVolume,
        hctValue: hctValue * 100, 
        deadVolume: highestDeadVolume, 
        requiredSampleVolume: requiredSampleVolume,  
        warning: warning,
        isCoagulation: isCoagulation,
        isCSFAnalyses: isCSFAnalyses,
        safetyMargin: safetyMargin
    };
}

function calculateSampleVolume() {
    // Get the hematocrit value and selected rows
    const hctValue = document.getElementById('hct').value;
    const selectedRows = document.querySelectorAll('#selectedAnalytesTable tbody tr');

    // Validate hematocrit value
    if (hctValue === '' || isNaN(hctValue) || hctValue < 0 || hctValue > 100) {
        alert('Please enter a valid hematocrit value between 0 and 100.');
        return;
    }

    // Check if any tests are selected
    if (selectedRows.length === 0) {
        alert('Please select at least one analysis.');
        return;
    }

    // Clear previous results
    const calculationResult = document.getElementById('calculationResult');
    calculationResult.innerHTML = '';

    // Get unique tube types from selected rows
    let tubeTypes = new Set();
    selectedRows.forEach(row => {
        tubeTypes.add(row.cells[1].textContent); 
    });

    // Calculate and display results for each tube type
    tubeTypes.forEach(type => {
        // Determine if it's a CSF or Coagulation tube (these don't need filling volume)
        const isCSFOrCoagulation = type.toLowerCase() === 'csf analyses' || 
                                   type.toLowerCase() === 'csf tube' || 
                                   type.toLowerCase() === 'coagulation';
        // Get filling volume for non-CSF and non-Coagulation tubes
        const fillingVolume = isCSFOrCoagulation ? null : parseFloat(document.getElementById(`fillingVolume${type}`).value);
        
        // Calculate results for this tube type
        let result = calculateForTubeType(type, fillingVolume, selectedRows);
        
        // Create a div to display the results
        let resultDiv = document.createElement('div');
        resultDiv.className = 'result_div';
        resultDiv.innerHTML = `
            <h4>${type}</h4>
            <br>Required Sample Volume: ${result.requiredSampleVolume.toFixed(2)} µl
            <br>Of which Dead Volume: ${result.deadVolume.toFixed(2)} µl
            ${result.safetyMargin > 0 ? `<br>Safety Margin: ${result.safetyMargin.toFixed(2)} µl` : ''}
            ${(type.toLowerCase().includes('heparin') || type.toLowerCase().includes('serum') || result.isCoagulation) ? 
              `<br>Considering a hematocrit of ${result.hctValue.toFixed(2)}%` : ''}
            <h5>Total Required Amount of ${type}: ${result.volume.toFixed(2)} µl</h5>`;
        
        // Add warning if the volume exceeds the filling volume
        if (result.warning) {
            resultDiv.innerHTML += `<p style="color: red;">WARNING: The required amount exceeds the maximum filling volume of the tube (${fillingVolume} µl).</p>`;
        }
        
        // Add special instruction for Coagulation tubes
        if (result.isCoagulation) {
            resultDiv.innerHTML += `<p style="color: red;">Please use the next biggest citrate-tube size to fit the amount of whole blood calculated and fill it to the max filling volume to ensure a correct blood:citrate-ratio</p>`;
        }
        
        // Add the result div to the page
        calculationResult.appendChild(resultDiv);
    });
}





function openTab(evt, groupName) {
    var i, tabcontent, tablinks;

    // Hide all tab contents
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Remove the 'active' class from all buttons in the tab container
    const tabContainer = document.querySelector('.tab');
    tablinks = tabContainer.getElementsByTagName('button');
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }

    // Show the current tab content and add the 'active' class to the clicked tab
    document.getElementById(groupName).style.display = "block";
    if (evt) {
        evt.currentTarget.classList.add("active");
    }
}

// Ensure the function is loaded as the DOM may load late
document.addEventListener('DOMContentLoaded', function() {
    createTabsAndCheckboxes(analytesData);
});