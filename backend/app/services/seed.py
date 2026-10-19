"""
SM TECHSPHERE domain-wise seed data.

Source:
    DOC-20260921-WA0008(1).pdf (8 handwritten pages)

Database mapping used by the existing models:
    Domain.name       = Domain
    Problem.name      = Category heading (A, B, C...)
    Problem.sub_domain= Individual sub-category / issue listed under heading
    Question          = Practical diagnostic questions drafted for that issue

IMPORTANT:
- Category/sub-category names below are transcribed from the supplied PDF as closely
  as possible; minor spelling/formatting has been normalized for consistency.
- The PDF lists domain/category/sub-category items, but does not provide questions.
  The questions here are proposed diagnostic questions based on each item.
- This seeder safely upserts domain/category/question records by their names/text.
  It does NOT delete existing enquiries or question answers.
"""

from app.models import Domain, Problem, Question, User, Role, AccountStatus
from app.core.security import hash_password
from app.core.config import settings


# Each tuple: (category, sub-category, questions)
DOMAIN_DATA = {
    "WATER & WASTEWATER TREATMENT": [
        ("Primary Effluent & Sewage Treatment",
         "High-toxicity industrial effluent load (ETP)", [
             "What is the current wastewater flow rate in KLD?",
             "What are the latest inlet COD, BOD and pH values?",
             "What toxic chemicals or contaminants are present?",
             "What treatment stages and ETP capacity are currently installed?",
         ]),
        ("Primary Effluent & Sewage Treatment",
         "Municipal domestic sewage treatment plant (STP)", [
             "What is the average and peak sewage flow in KLD?",
             "What are the inlet BOD, COD and TSS values?",
             "What is the required treated-water quality and reuse standard?",
             "What is the existing STP process and capacity?",
         ]),
        ("Primary Effluent & Sewage Treatment",
         "Multi-facility influent volatility (CETP)", [
             "How many facilities discharge into the CETP?",
             "How much do flow and pollutant loads vary during the day?",
             "What are the typical and peak COD, BOD, pH and TDS values?",
             "What equalization and online monitoring systems are available?",
         ]),
        ("High Recovery Advanced Water Engineering",
         "Stringent zero-liquid-discharge mandates (ZLD)", [
             "What is the required water recovery percentage?",
             "What are the feed flow, TDS and major dissolved constituents?",
             "Which RO, MEE or crystallizer systems are already installed?",
             "What are the discharge restrictions and ZLD compliance deadlines?",
         ]),
        ("High Recovery Advanced Water Engineering",
         "Concentrated thermal brine accumulation (crystallizer & evaporation systems)", [
             "What is the brine volume and concentration range?",
             "What are the brine composition and scaling tendencies?",
             "What evaporation or crystallization equipment is installed?",
             "How is the recovered salt or final residue currently handled?",
         ]),
        ("High Recovery Advanced Water Engineering",
         "High-salinity RO feed (desalination lines)", [
             "What is the feed-water TDS and temperature range?",
             "What permeate capacity and water quality are required?",
             "What recovery rate and operating pressure are targeted?",
             "What membrane fouling or scaling issues occur currently?",
         ]),
        ("Biological & Advanced Membrane Solutions",
         "High-BOD suspended organic loading (MBBR)", [
             "What are the average flow, inlet BOD and COD values?",
             "What is the required treated-water quality?",
             "What MBBR tank volume and media fill fraction are available?",
             "Are there issues with shock loads, aeration or sludge settling?",
         ]),
        ("Biological & Advanced Membrane Solutions",
         "Footprint-constrained biological deficit (MBR)", [
             "What flow and treatment capacity are required at the site?",
             "What space is available for the treatment plant?",
             "What effluent limits must the MBR meet?",
             "What are the current sludge, membrane fouling and energy issues?",
         ]),
        ("Biological & Advanced Membrane Solutions",
         "Conventional activated sludge process (ASP) – operational optimization", [
             "What are the current MLSS, SRT and dissolved oxygen values?",
             "What are the inlet and outlet BOD, COD and TSS values?",
             "Are bulking, foaming or settling problems observed?",
             "What are the current aeration energy and sludge disposal costs?",
         ]),
        ("Biological & Advanced Membrane Solutions",
         "Batch-fed volumetric shock loads (SBR cycling)", [
             "What is the batch volume and cycle duration?",
             "How much do flow and organic load vary between batches?",
             "What are the current fill, react, settle and decant timings?",
             "Are there issues with cycle stability or final effluent quality?",
         ]),
        ("Fine Filtration & Pre-treatment Nodes",
         "Colloidal / macromolecular cake fouling (UF)", [
             "What is the feed turbidity and suspended-solids concentration?",
             "What are the current UF flux and transmembrane pressure?",
             "How frequently is backwashing or chemical cleaning required?",
             "What pretreatment is installed upstream of the UF system?",
         ]),
        ("Fine Filtration & Pre-treatment Nodes",
         "Coarse suspended particulate drag (MF)", [
             "What particle sizes and suspended-solids loads are present?",
             "What flow rate and filtration efficiency are required?",
             "What are the current pressure drop and filter-cleaning frequency?",
             "What filter media or microfiltration equipment is installed?",
         ]),
        ("Fine Filtration & Pre-treatment Nodes",
         "High-chloride dissolved mineral scale (DM / ion exchange)", [
             "What are the chloride, hardness and TDS concentrations?",
             "Which dissolved ions need to be removed?",
             "What ion-exchange or demineralization equipment is installed?",
             "How often does regeneration occur and what is the chemical use?",
         ]),
        ("Specialized Electrochemical & Recovery Systems",
         "Refractory chemicals / COD shielding (electrochemical & electrocoagulation methods)", [
             "Which refractory chemicals are present in the wastewater?",
             "What are the COD, conductivity and pH values?",
             "What electrochemical or electrocoagulation process is currently used?",
             "What removal target and operating cost are required?",
         ]),
        ("Specialized Electrochemical & Recovery Systems",
         "Bio-fouling membrane degradation (membrane-care chemical dosing / routing)", [
             "Which membrane type and membrane age are involved?",
             "What symptoms of biofouling or performance loss are observed?",
             "What cleaning chemicals, dosage and cleaning frequency are used?",
             "What are the feed-water microbiology and operating conditions?",
         ]),
        ("Specialized Electrochemical & Recovery Systems",
         "Valuable metal & nutrient wastewater (resource recovery / precious-element extraction loops)", [
             "Which valuable metals or nutrients are present?",
             "What are their concentrations and daily wastewater volume?",
             "What recovery purity and recovery percentage are required?",
             "What recovery, extraction or precipitation processes are already used?",
         ]),
        ("Specialized Electrochemical & Recovery Systems",
         "High-turbidity surface-water intake (tube-settler clarifier systems)", [
             "What are the source-water turbidity and seasonal peak values?",
             "What intake flow and clarified-water quality are required?",
             "What coagulation, flocculation and clarification equipment is installed?",
             "What are the available footprint and sludge-handling arrangements?",
         ]),
    ],

    "SOLID AND HAZARDOUS WASTE": [
        ("Collection & Pre-processing",
         "Material recovery facility (MRF)", [
             "What waste types and recyclable material fractions are received?",
             "What is the daily waste quantity and peak throughput?",
             "What sorting, baling and storage equipment is available?",
             "What recovery targets and contamination limits apply?",
         ]),
        ("Collection & Pre-processing",
         "Shredding & baling", [
             "Which materials need shredding or baling?",
             "What is the required throughput per hour or day?",
             "What output size, bale density or packaging format is required?",
             "What power, safety and dust-control provisions are available?",
         ]),
        ("Collection & Pre-processing",
         "Magnetic & eddy-current separation", [
             "Which ferrous and non-ferrous metals need to be separated?",
             "What is the feed material composition and throughput?",
             "What metal purity and recovery rate are required?",
             "What conveyor and separation equipment is already installed?",
         ]),
        ("Collection & Pre-processing",
         "Screening & air classification", [
             "What is the input material and particle-size distribution?",
             "What throughput and separation cut sizes are required?",
             "What dust collection and air-handling systems are available?",
             "What are the current screening losses or contamination issues?",
         ]),
        ("Collection & Pre-processing",
         "TSDF storage & transfer stations", [
             "What hazardous waste categories and quantities are handled?",
             "What storage duration and transfer frequency are required?",
             "What containment, labelling and tracking systems are in place?",
             "Which permits and safety procedures apply to the facility?",
         ]),
        ("Thermal & Advanced Recovery (Waste-to-Energy)",
         "Incineration", [
             "What waste types, moisture content and calorific value are expected?",
             "What is the required daily treatment capacity?",
             "What flue-gas cleaning and emission monitoring are installed?",
             "How are ash and other residues handled?",
         ]),
        ("Thermal & Advanced Recovery (Waste-to-Energy)",
         "Pyrolysis", [
             "What feedstock type, moisture and particle size are available?",
             "What is the required throughput and target product yield?",
             "Which products are required (oil, gas, char or others)?",
             "What emission control and residue-handling systems are available?",
         ]),
        ("Thermal & Advanced Recovery (Waste-to-Energy)",
         "Gasification", [
             "What feedstock composition and calorific value are available?",
             "What gas output and plant capacity are required?",
             "What gas-cleaning and tar-removal systems are planned?",
             "How will syngas be used and emissions monitored?",
         ]),
        ("Thermal & Advanced Recovery (Waste-to-Energy)",
         "Plasma arc gasification", [
             "What waste composition and feed rate must be processed?",
             "What are the required syngas or vitrified-slag outputs?",
             "What power supply and plasma system capacity are available?",
             "What gas treatment and emissions controls are required?",
         ]),
        ("Thermal & Advanced Recovery (Waste-to-Energy)",
         "WTE (waste-to-energy plants)", [
             "What is the daily waste quantity and calorific value?",
             "What electricity or thermal output is targeted?",
             "What grid connection and plant footprint are available?",
             "What emission limits and ash-disposal arrangements apply?",
         ]),
        ("Thermal & Advanced Recovery (Waste-to-Energy)",
         "Co-processing", [
             "Which waste streams are suitable for co-processing?",
             "What are the waste's calorific value, moisture and chlorine levels?",
             "What receiving and feeding systems are available?",
             "What pre-acceptance testing and compliance documents are required?",
         ]),
        ("Biological Treatment (Organic Waste)",
         "Biomethanation", [
             "What organic waste types and daily quantities are available?",
             "What are the feedstock moisture and organic content?",
             "What biogas output and end-use are expected?",
             "How will digestate and process odour be managed?",
         ]),
        ("Biological Treatment (Organic Waste)",
         "Composting", [
             "What organic waste types and daily tonnage are generated?",
             "What are the moisture, C:N ratio and contamination levels?",
             "What composting method and site area are available?",
             "What finished-compost quality and market requirements apply?",
         ]),
        ("Chemical & Stabilization Treatments",
         "Solidification & stabilization", [
             "What hazardous constituents are present in the waste?",
             "What are the waste volume and physical characteristics?",
             "What leachability or stabilization standards must be met?",
             "What binders, treatment equipment and disposal route are available?",
         ]),
        ("Chemical & Stabilization Treatments",
         "Neutralization & chemical treatment", [
             "What is the waste pH and chemical composition?",
             "What volume needs treatment per day?",
             "Which treatment chemicals and dosing systems are currently used?",
             "What final discharge or disposal criteria must be met?",
         ]),
        ("Specialized Recycling & Compliance",
         "E-waste recycling", [
             "Which electronic waste categories are handled?",
             "What is the monthly input volume and expected recovery?",
             "What dismantling, sorting and material recovery systems are installed?",
             "What authorizations and downstream recycler records are available?",
         ]),
        ("Specialized Recycling & Compliance",
         "Biomedical waste autoclaving", [
             "What biomedical waste categories and daily quantities are received?",
             "What autoclave capacity and cycle validation are available?",
             "How are treated waste and rejected loads handled?",
             "What monitoring logs and authorizations are maintained?",
         ]),
        ("Specialized Recycling & Compliance",
         "Battery & polymer recycling", [
             "Which battery chemistries and polymer types are processed?",
             "What is the monthly processing volume?",
             "What dismantling, sorting and recovery technologies are used?",
             "What fire safety, pollution-control and compliance approvals are available?",
         ]),
        ("Specialized Recycling & Compliance",
         "EPR (extended producer responsibility)", [
             "Which product categories and EPR obligations apply?",
             "What are the annual collection and recycling targets?",
             "What certificates, returns and traceability records are maintained?",
             "Are there any pending compliance gaps or reporting deadlines?",
         ]),
        ("Final Containment",
         "Secured landfill", [
             "What waste classification and annual disposal quantity are expected?",
             "What site capacity and remaining landfill life are available?",
             "What liner, leachate collection and groundwater monitoring systems exist?",
             "What acceptance criteria and regulatory approvals apply?",
         ]),
    ],

    "SOLAR AND RENEWABLE ENERGY": [
        ("Capital Efficiency & Grid Integration (financial efficiency)",
         "CAPEX-constrained utility drag", [
             "What is the current electricity demand and monthly bill?",
             "What CAPEX budget and payback period are acceptable?",
             "What utility tariff, demand charges and contract terms apply?",
             "What energy-efficiency or renewable options have been assessed?",
         ]),
        ("Capital Efficiency & Grid Integration (financial efficiency)",
         "Underutilized capital tax leakage", [
             "What renewable-energy or efficiency assets are currently owned?",
             "What incentives, tax benefits or depreciation claims are being used?",
             "What is the project investment and commissioning timeline?",
             "What financial or tax-utilization gap has been identified?",
         ]),
        ("Capital Efficiency & Grid Integration (financial efficiency)",
         "Spatial zero-rooftop boundary", [
             "What rooftop area and structural load capacity are available?",
             "What is the site's electricity consumption profile?",
             "Are carports, ground-mounted solar or open-access options feasible?",
             "What site, shading and grid-connection constraints apply?",
         ]),
        ("Capital Efficiency & Grid Integration (financial efficiency)",
         "Holiday generation leakage", [
             "What is the site's operating calendar and holiday schedule?",
             "What is the hourly electricity load during non-working days?",
             "How much renewable generation is curtailed or exported?",
             "Are storage, load shifting or export arrangements available?",
         ]),
        ("Thermal Utility De-fossilization (high-emissions factory boilers)",
         "High-cost low-temperature thermal demand", [
             "What process temperatures and thermal loads are required?",
             "What is the current fuel consumption and cost?",
             "Can heat pumps, solar thermal or waste-heat recovery be integrated?",
             "What uptime, payback and process constraints apply?",
         ]),
        ("Thermal Utility De-fossilization (high-emissions factory boilers)",
         "Carbon-heavy solid-fuel penalty", [
             "Which solid fuels are used and in what annual quantity?",
             "What are the fuel cost, calorific value and emissions profile?",
             "What alternative fuels or biomass options are technically feasible?",
             "What boiler modifications and fuel-handling changes are required?",
         ]),
        ("Thermal Utility De-fossilization (high-emissions factory boilers)",
         "High-pressure process steam deficit", [
             "What steam pressure, temperature and flow are required?",
             "What are the current steam-generation and distribution losses?",
             "What is the peak demand and existing boiler capacity?",
             "Can heat recovery or efficient steam generation close the deficit?",
         ]),
        ("Thermal Utility De-fossilization (high-emissions factory boilers)",
         "High-emission chemical feedstock penalty", [
             "Which chemical feedstocks and process reactions generate emissions?",
             "What are the annual feedstock usage and associated emissions?",
             "What lower-carbon feedstock or process alternatives are feasible?",
             "What product-quality and operating constraints must be maintained?",
         ]),
        ("Power Quality & Micro-grid Resilience",
         "Grid brownout / voltage-change penalties", [
             "How often do brownouts, voltage dips or outages occur?",
             "What loads and production processes are affected?",
             "Are power-quality measurements and event logs available?",
             "What backup, conditioning or ride-through systems are installed?",
         ]),
        ("Power Quality & Micro-grid Resilience",
         "DG-solar synchronization conflict", [
             "What DG and solar inverter capacities are installed?",
             "What synchronization, protection or reverse-power issues occur?",
             "What are the site's load profile and operating modes?",
             "What controller, relay and metering systems are available?",
         ]),
        ("Power Quality & Micro-grid Resilience",
         "Isolated infrastructure transmission drag", [
             "What is the site's connection voltage and distance to the grid?",
             "What transmission losses and reliability issues are observed?",
             "What distributed generation or microgrid assets are available?",
             "What critical loads and autonomy duration must be supported?",
         ]),
        ("Agro-Industrial Logistics & Supply Chains",
         "Daylight irrigation intermittency", [
             "What is the irrigation load and daily operating schedule?",
             "What solar capacity and water-storage capacity are available?",
             "How does seasonal solar generation compare with irrigation demand?",
             "Are pumps, controllers or storage systems already installed?",
         ]),
        ("Agro-Industrial Logistics & Supply Chains",
         "Supply-chain raw-material spoilage", [
             "Which raw materials spoil and what quantities are lost?",
             "What are the storage, transport and temperature-control conditions?",
             "How long are typical procurement and delivery lead times?",
             "Could renewable-powered cold storage or monitoring reduce losses?",
         ]),
        ("Agro-Industrial Logistics & Supply Chains",
         "Perimeter security power drains", [
             "Which perimeter systems require continuous power?",
             "What is the total load and required backup duration?",
             "Are grid access and cable runs difficult or costly?",
             "Could standalone solar, batteries or hybrid power meet the load?",
         ]),
        ("Asset Optimization & Digital Intelligence",
         "Soiling degradation losses", [
             "What is the installed solar capacity and measured generation?",
             "How often are panels cleaned and what is the local dust profile?",
             "What generation loss is attributed to soiling?",
             "Are cleaning robots, sensors or automated schedules in use?",
         ]),
        ("Asset Optimization & Digital Intelligence",
         "Performance ratio (PR) blind spots", [
             "What are the plant's measured PR and energy-yield values?",
             "Are irradiance, module temperature and inverter data available?",
             "How are performance deviations detected and reported?",
             "What monitoring platform and sensor calibration are used?",
         ]),
        ("Asset Optimization & Digital Intelligence",
         "Multi-vendor fragmentation risk", [
             "How many vendors and monitoring platforms manage the assets?",
             "Which data formats, protocols and APIs are available?",
             "What operational or reporting gaps arise between systems?",
             "What unified monitoring and service-level requirements are needed?",
         ]),
        ("Alternative Fuels & Fleet Decarbonization",
         "Organic wet-waste financial leakage", [
             "What organic wet-waste quantity is generated each day?",
             "What are the current collection, transport and disposal costs?",
             "Could biomethane or another recovery route use this feedstock?",
             "What site, offtake and feedstock-quality constraints apply?",
         ]),
        ("Alternative Fuels & Fleet Decarbonization",
         "Logistics fleet Scope 3 burden", [
             "How many vehicles are operated and what distances do they cover?",
             "What are the annual fuel use and fleet emissions?",
             "What vehicle payload, range and route constraints apply?",
             "Are EV, biofuel or route-optimization options being evaluated?",
         ]),
        ("Regulatory Compliance Mechanisms",
         "Statutory RPO (renewable purchase obligation) default risk", [
             "Which RPO obligations and compliance period apply?",
             "What is the current renewable-energy consumption or procurement?",
             "What shortfall, certificates or reporting records are outstanding?",
             "What is the compliance deadline and evidence required?",
         ]),
    ],

    "CARBON AND ESG": [
        ("Scope 1 – Direct Operational Carbon Footprint",
         "Fossil-fuel thermal emission drag", [
             "Which fossil fuels are consumed on site and in what quantities?",
             "What are the annual fuel use and available emission factors?",
             "Which boilers, furnaces or thermal systems are major emitters?",
             "What reduction target and reporting boundary apply?",
         ]),
        ("Scope 1 – Direct Operational Carbon Footprint",
         "Industrial process carbon intensity", [
             "Which industrial processes generate direct emissions?",
             "What production volumes and process-emission data are available?",
             "How are emissions allocated per unit of product?",
             "What process changes or abatement options are being assessed?",
         ]),
        ("Scope 1 – Direct Operational Carbon Footprint",
         "Internal carbon pricing deficit", [
             "Is an internal carbon price currently used?",
             "What emissions and investment decisions would it cover?",
             "What carbon price assumptions and scenarios are considered?",
             "How are carbon costs included in project appraisal?",
         ]),
        ("Scope 2 – Indirect Energy Tracking",
         "High-emission grid-power dependency", [
             "What is annual grid electricity consumption by site?",
             "What grid emission factor and reporting method are used?",
             "What renewable procurement or onsite generation is available?",
             "What emissions-reduction target and timeline apply?",
         ]),
        ("Scope 2 – Indirect Energy Tracking",
         "Thermal utility carbon premium", [
             "What purchased steam, heat or cooling is consumed?",
             "What are the annual quantities and supplier emission factors?",
             "What costs and emissions are associated with thermal utilities?",
             "What efficiency or lower-carbon supply options are available?",
         ]),
        ("Scope 3 – Supply-Chain Vulnerabilities",
         "Upstream supplier carbon blind spots", [
             "Which purchased goods and suppliers contribute most to emissions?",
             "What supplier-specific activity or emissions data is available?",
             "How are estimates, emission factors and data quality documented?",
             "What supplier engagement and data-collection process is used?",
         ]),
        ("Scope 3 – Supply-Chain Vulnerabilities",
         "Downstream logistics footprint penalties", [
             "What outbound transport modes, distances and tonnage are involved?",
             "What fuel or carrier emissions data is available?",
             "How are logistics emissions calculated and reported?",
             "What route, mode or carrier changes could reduce emissions?",
         ]),
        ("Scope 3 – Supply-Chain Vulnerabilities",
         "Employee commute emission drag", [
             "How many employees commute and by which modes?",
             "What are typical commute distances and workday patterns?",
             "Is commute survey or travel data available?",
             "What public transport, shuttle or hybrid-work options exist?",
         ]),
        ("Global Trade & Cross-Border Compliance",
         "Cross-border carbon tax (CBAM) exposure", [
             "Which products are exported to markets with carbon requirements?",
             "What product quantities and embedded-emissions data are available?",
             "What reporting periods, verification and documentation apply?",
             "What is the current process for tracking regulatory changes?",
         ]),
        ("Global Trade & Cross-Border Compliance",
         "Linear product lifecycle penalty", [
             "What are the major material inputs and end-of-life routes?",
             "What product lifecycle assessment data is available?",
             "What reuse, repair, recycling or recycled-content options exist?",
             "Which lifecycle impact metrics and customer requirements apply?",
         ]),
        ("Global Trade & Cross-Border Compliance",
         "Eco-label marketing vulnerability", [
             "Which environmental claims and eco-labels are currently used?",
             "What evidence and third-party verification support each claim?",
             "Which standards or customer requirements apply?",
             "Are there gaps in traceability, substantiation or approvals?",
         ]),
        ("ESG Disclosures & Global Frameworks",
         "Regulatory BRSR framework default", [
             "Is BRSR or BRSR Core reporting applicable to the organization?",
             "Which required ESG indicators and source data are available?",
             "Who owns data collection, validation and sign-off?",
             "What reporting period and submission deadline apply?",
         ]),
        ("ESG Disclosures & Global Frameworks",
         "Global Sustainability Disclosure Groups", [
             "Which sustainability disclosure frameworks are required?",
             "What governance, risk, metrics and target data is collected?",
             "What materiality assessment and reporting controls exist?",
             "What gaps remain against the applicable framework?",
         ]),
        ("ESG Disclosures & Global Frameworks",
         "Corporate greenwashing litigation risk", [
             "What public environmental claims and targets has the company made?",
             "What evidence supports the claims and progress statements?",
             "Who reviews claims before publication?",
             "Are any complaints, investigations or legal notices pending?",
         ]),
        ("Sustainable Finance & Banking",
         "Green financing capital bottlenecks", [
             "What sustainability projects require financing and what is the CAPEX?",
             "Which green-loan or sustainability-linked finance options are considered?",
             "What eligibility evidence, KPIs and verification are available?",
             "What financing terms or documentation are blocking progress?",
         ]),
        ("Sustainable Finance & Banking",
         "Climate-scenario physical vulnerability", [
             "Which sites and assets face flood, heat, drought or storm risks?",
             "What climate scenarios and time horizons are being assessed?",
             "What operational and financial impacts have been estimated?",
             "What adaptation measures and resilience plans are in place?",
         ]),
        ("Social & Governance (S and G metrics)",
         "Supply-chain human-rights blind spots", [
             "Which suppliers and geographies are considered higher risk?",
             "What supplier screening, audits and grievance channels exist?",
             "What corrective actions or unresolved findings are recorded?",
             "How are human-rights risks monitored and reported?",
         ]),
        ("Social & Governance (S and G metrics)",
         "Occupational health & safety exposure", [
             "What are the major workplace hazards and incident trends?",
             "What safety audits, training and risk assessments are current?",
             "What corrective actions remain open?",
             "Which health and safety metrics are tracked by site?",
         ]),
        ("Social & Governance (S and G metrics)",
         "Corporate anti-corruption compliance deficit", [
             "What anti-bribery and conflict-of-interest policies are in place?",
             "What employee and third-party training is completed?",
             "What due diligence and reporting channels exist?",
             "Are any investigations, findings or remediation actions pending?",
         ]),
        ("Social & Governance (S and G metrics)",
         "Board-level diversity & ESG governance", [
             "What board composition and diversity metrics are tracked?",
             "Which board committee oversees ESG and sustainability?",
             "How frequently are ESG risks and targets reviewed?",
             "What governance gaps or disclosure requirements remain?",
         ]),
    ],

    "AIR POLLUTION & ENVIRONMENTAL LEGAL SERVICES": [
        ("Industrial Air Pollution Engineering (physical solutions)",
         "Fugitive particulate emission drag", [
             "Which processes generate fugitive dust and particulate emissions?",
             "What are the emission sources, quantities and operating hours?",
             "What extraction, filtration or dust-suppression equipment is installed?",
             "What monitoring results and emission limits apply?",
         ]),
        ("Industrial Air Pollution Engineering (physical solutions)",
         "Acidic & toxic gas venting", [
             "Which acidic or toxic gases are emitted and at what flow rate?",
             "What are the gas concentrations, temperature and humidity?",
             "What scrubbers, ducts and monitoring systems are installed?",
             "What exposure and stack-emission limits must be met?",
         ]),
        ("Industrial Air Pollution Engineering (physical solutions)",
         "Fugitive VOC process discharges", [
             "Which processes, tanks or equipment release VOCs?",
             "What are the VOC types, concentrations and release patterns?",
             "What vapour recovery, adsorption or oxidation systems are installed?",
             "What monitoring and reduction targets apply?",
         ]),
        ("Industrial Air Pollution Engineering (physical solutions)",
         "Odour & hazardous vapour infractions", [
             "What are the suspected odour or hazardous-vapour sources?",
             "When and where are odour events most frequently reported?",
             "What containment, scrubbing or treatment systems are available?",
             "Are complaints, monitoring results or notices recorded?",
         ]),
        ("Industrial Air Pollution Engineering (physical solutions)",
         "OCEMS hardware calibration slip", [
             "Which pollutants and parameters are monitored by OCEMS?",
             "When were the analyzers and sensors last calibrated?",
             "Are data gaps, drift or communication failures occurring?",
             "What calibration certificates and compliance logs are available?",
         ]),
        ("Statutory SPCB Consents & Approvals (documentation & paperwork)",
         "CTE / CTO application deadlocks", [
             "Is the application for Consent to Establish or Consent to Operate?",
             "Which SPCB, application reference and industry category apply?",
             "What documents, inspections or clarifications are pending?",
             "What are the submission and renewal deadlines?",
         ]),
        ("Statutory SPCB Consents & Approvals (documentation & paperwork)",
         "Hazardous waste authorization defaults", [
             "Which hazardous waste categories and quantities are generated?",
             "What authorization and validity period currently apply?",
             "Are annual returns, manifests or disposal records outstanding?",
             "Which deficiencies or renewal actions need closure?",
         ]),
        ("Statutory SPCB Consents & Approvals (documentation & paperwork)",
         "E-waste & plastic EPR compliance gaps", [
             "Which EPR category and producer/importer/brand-owner role applies?",
             "What are the applicable collection or recycling obligations?",
             "What portal filings, certificates and records are available?",
             "Are targets, returns or renewal deadlines pending?",
         ]),
        ("Statutory SPCB Consents & Approvals (documentation & paperwork)",
         "CGWA groundwater-extraction deficit", [
             "What is the site's groundwater extraction quantity and purpose?",
             "What CGWA NOC or permission is currently held?",
             "Are meters, recharge structures and water audits available?",
             "What reporting, renewal or compliance gaps remain?",
         ]),
        ("Statutory SPCB Consents & Approvals (documentation & paperwork)",
         "Environmental clearance milestone delays", [
             "Which project and environmental clearance conditions apply?",
             "What milestones, studies or approvals are pending?",
             "What baseline monitoring and compliance reports are available?",
             "What are the required submission dates and project dependencies?",
         ]),
        ("SPCB Enforcement & Litigation Defense (legal services)",
         "SPCB show-cause & closure notices", [
             "What notice was received and on what date?",
             "What observations, directions and response deadlines are stated?",
             "What monitoring data and compliance evidence are available?",
             "What corrective actions have already been completed?",
         ]),
        ("SPCB Enforcement & Litigation Defense (legal services)",
         "Forfeiture of compliance bank guarantees", [
             "What order or condition governs the bank guarantee?",
             "What compliance obligations or alleged defaults are cited?",
             "What supporting records and correspondence are available?",
             "What deadlines or appeal / representation steps are pending?",
         ]),
        ("SPCB Enforcement & Litigation Defense (legal services)",
         "Environmental compensation penalties", [
             "What order specifies the compensation and calculation period?",
             "Which alleged violations and monitoring records are cited?",
             "What remediation and compliance actions have been completed?",
             "What review, response or payment deadline applies?",
         ]),
        ("SPCB Enforcement & Litigation Defense (legal services)",
         "NGT tribunal litigation drag", [
             "What is the case reference, tribunal bench and current stage?",
             "What directions, filings and deadlines are outstanding?",
             "What technical reports and compliance evidence are available?",
             "Which site actions or expert assessments are needed?",
         ]),
        ("Factory Infrastructure & Safety Audits (site compliance)",
         "Boundary noise attenuation breaches", [
             "What are the measured boundary noise levels and time periods?",
             "Which equipment or operations are the dominant noise sources?",
             "What barriers, enclosures or silencers are installed?",
             "What applicable noise limits and complaint records exist?",
         ]),
        ("Factory Infrastructure & Safety Audits (site compliance)",
         "Greenbelt allocation shortfall", [
             "What is the plot area and required greenbelt area?",
             "What greenbelt area and plantation survival rate are documented?",
             "Are approved site plans and plantation records available?",
             "What land, irrigation or maintenance constraints exist?",
         ]),
        ("Factory Infrastructure & Safety Audits (site compliance)",
         "Form V environmental statement discrepancies", [
             "Which reporting year and Form V submission are involved?",
             "What discrepancies exist in water, energy, waste or emissions data?",
             "What source records and calculations support the reported figures?",
             "What correction and submission deadlines apply?",
         ]),
        ("Factory Infrastructure & Safety Audits (site compliance)",
         "Public Liability Insurance Act (PLIA) gaps", [
             "Does the site handle hazardous substances covered by the Act?",
             "What public liability insurance policy and validity are in place?",
             "Are required premium, policy and relief-fund records available?",
             "What compliance gaps or renewal dates need attention?",
         ]),
        ("Legacy & Supply Chain Risk Capping",
         "Legacy contamination clean-up claims", [
             "What site contamination or historical release is suspected?",
             "What soil, groundwater or environmental investigation data exists?",
             "What remediation obligations, claims or liabilities are identified?",
             "What cleanup plan, budget and verification requirements apply?",
         ]),
        ("Legacy & Supply Chain Risk Capping",
         "Vendor environmental compliance due diligence", [
             "Which vendors and environmental risk categories are in scope?",
             "What permits, consents, audit reports and waste records are available?",
             "Are any vendor notices, violations or expired approvals identified?",
             "What risk scoring and corrective-action follow-up is required?",
         ]),
    ],
}


def seed_database(db):
    """
    Insert missing records and update matching records without deleting data.

    Matching rules:
    - Domain: by unique name
    - Problem: by (domain_id, category name, sub-category)
    - Question: by (problem_id, question_text)

    Existing question answers and enquiries are not deleted.
    """
    for domain_name, entries in DOMAIN_DATA.items():
        domain = db.query(Domain).filter(Domain.name == domain_name).first()
        if domain is None:
            domain = Domain(
                name=domain_name,
                description=f"Domain for environmental and industrial solutions: {domain_name}.",
            )
            db.add(domain)
            db.flush()
        else:
            domain.description = (
                f"Domain for environmental and industrial solutions: {domain_name}."
            )

        for category, sub_category, questions in entries:
            problem = (
                db.query(Problem)
                .filter(
                    Problem.domain_id == domain.id,
                    Problem.name == category,
                    Problem.sub_domain == sub_category,
                )
                .first()
            )
            if problem is None:
                problem = Problem(
                    domain_id=domain.id,
                    name=category,
                    sub_domain=sub_category,
                    description=f"{sub_category} under {category}.",
                )
                db.add(problem)
                db.flush()
            else:
                problem.description = f"{sub_category} under {category}."

            for index, question_text in enumerate(questions, start=1):
                question = (
                    db.query(Question)
                    .filter(
                        Question.problem_id == problem.id,
                        Question.question_text == question_text,
                    )
                    .first()
                )
                if question is None:
                    question = Question(
                        problem_id=problem.id,
                        question_text=question_text,
                        field_key=f"q{index}",
                        required=True,
                    )
                    db.add(question)
                else:
                    question.field_key = f"q{index}"
                    question.required = True

    db.commit()

    # Preserve the existing admin-user bootstrap behavior.
    admin = db.query(User).filter(User.email == settings.ADMIN_EMAIL).first()
    if not admin:
        admin = User(
            full_name="Platform Admin",
            email=settings.ADMIN_EMAIL,
            phone="0000000000",
            password_hash=hash_password(settings.ADMIN_PASSWORD),
            role=Role.ADMIN.value,
            status=AccountStatus.ACTIVE.value,
            email_verified=True,
            is_active=True,
        )
        db.add(admin)
        db.commit()
