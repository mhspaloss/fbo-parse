var dailyOpps = [
	[{
		"PRESOL": {
			"DATE": "1105",
			"YEAR": "18",
			"AGENCY": "Department of the Air Force",
			"OFFICE": "Air Force Materiel Command",
			"LOCATION": "AFRL/RQK - WPAFB",
			"ZIP": "45433",
			"CLASSCOD": "A",
			"NAICS": "541715",
			"OFFADD": "AFRL/RQK\r\n2130 Eighth Street, Building 45 Wright-Patterson AFB OH 45433",
			"SUBJECT": "Nondestructive Evaluation (NDE) Exploratory Development and Inspection Support for Air Force Systems",
			"SOLNBR": "FA8650-19-S-5002",
			"ARCHDATE": "01072019",
			"CONTACT": "Whitney L. Foxbower, Contracting Officer, Phone 937-713-9877, Email whitney.foxbower@us.af.mil - Morgan Suntay, Contract Negotiator, Phone 937-713-9899, Email morgan.suntay@us.af.mil",
			"DESC": "The purpose of this notice is to provide information about a Broad Agency Announcement (BAA) for Nondestructive Evaluation (NDE) Exploratory Development and Inspection Support for Air Force Systems.",
			"LINK": "",
			"URL": "https://www.fbo.gov/spg/USAF/AFMC/AFRLWRS/FA8650-19-S-5002/listing.html",
			"DESC2": "Link To Document",
			"SETASIDE": "N/A",
			"POPCOUNTRY": "US",
			"POPADDRESS": "Contractor facility and the Air Force Research Laboratory (AFRL), Materials & Manufacturing Directorate, WPAFB, OH"
		}
	}],
	[{
		"PRESOL": {
			"DATE": "1105",
			"YEAR": "18",
			"AGENCY": "Department of the Army",
			"OFFICE": "Army Contracting Command",
			"LOCATION": "ACC - APG (W56JSR) Division E",
			"ZIP": "21005-1846",
			"CLASSCOD": "70",
			"NAICS": "541519",
			"OFFADD": "6565 Surveillance Loop\r\nBuilding 6001\r\n Aberdeen Proving Ground MD 21005-1846",
			"SUBJECT": "Oracle Database Enterprise Edition & Oracle WebLogic Server Maintenance",
			"SOLNBR": "Oracle-Maintenace-Renewal",
			"RESPDATE": "110818",
			"CONTACT": "Bryant S. Herbert, Contracts Analyst, Phone 443-861-7996, Email bryant.s.herbert.civ@mail.mil",
			"DESC": "<p>Good Morning This is a Request for Information regarding a Software maintenance Renewal for the attached Spreadsheet. Please supply a price quote for the attached Excel Spreadsheet. The Spreadsheet covers the Maintenance Renewal for the following Oracle Products</p>\r\n<p>1. Oracle Database Enterprise Edition - Nonstandard User</p>\r\n<p>2. Oracle WebLogic Server Standard Edition Maintenance</p>\r\n<p>The Request will cover 1 base Year of Maintenance Pricing and 3 Option Years of Pricing.</p>\r\n<p><br />The Army Acquisition center Aberdeen proving Grounds will be soliciting this effort Officially one the Market Research has been completed and the Acquisition package has been submitted for Award. This effort is Projected to be awarded prior to 30 November 2018 deadline.</p>\r\n<p>&nbsp;</p>\r\n<p>Thanks.</p>\r\n<p>&nbsp;</p>",
			"LINK": "",
			"URL": "https://www.fbo.gov/notices/bd26d0b04011ee66bd835aa4ef43b893",
			"DESC2": "Link To Document",
			"SETASIDE": "N/A"
		}
	}],
  [{
		"AWARD": {
			"DATE": "1105",
			"YEAR": "18",
			"AGENCY": "Department of Homeland Security",
			"OFFICE": "United States Coast Guard (USCG)",
			"LOCATION": "Commanding Officer, USCG Operations Systems Center",
			"ZIP": "25430",
			"CLASSCOD": "D",
			"NAICS": "541512",
			"OFFADD": "600 Coast Guard Drive Kearneysville WV 25430",
			"SUBJECT": "Direct Access O&M Support Services",
			"SOLNBR": "70Z0G319RPWZ00100",
			"CONTACT": "Craig E. Anderson, Contracting Officer, Phone 3044333930, Email craig.e.anderson@uscg.mil",
			"AWDNBR": "70Z0G319FPWZ00100",
			"AWDAMT": "$4784663.17",
			"AWDDATE": "103118",
			"ARCHDATE": "12062018",
			"AWARDEE": "SRA International, Inc.",
			"DESC": "Post-Award Notification and Limited Source Justification Posting.",
			"LINK": "",
			"URL": "https://www.fbo.gov/spg/DHS/USCG/COUSCGOSC/Awards/70Z0G319FPWZ00100.html",
			"DESC2": "Link To Document"
		}
	}]
];

//to run node.js, read data from file and over-write dailyOpps above.
//Comment out to use above data structure for dailyOpps and Chrome debugging tools

var fs = require("fs");
var parser = require("./index");

//fs.writeFileSync('Output Files/20181105.json', JSON.stringify(parser.parse(fs.readFileSync('Input Files/FBOFeed20181105', 'UTF-8'))));

//Read JSON file and create dailyOpps object.
//var dailyOpps = parser.parse(fs.readFileSync('Input Files/FBOFeed20181105', 'UTF-8'));

//filter out badly formed or uninteresting opportunities
function isInteresting(element) {

  //set myNaicsStr string object to identify the NAICS Codes I care about
  const myDealType = 'PRESOL SRCSGT COMBINE';

  //set myNaicsStr string object to identify the NAICS Codes I care about
  const myNaicsStr = '54133 541330 5415 54151 541511 541512 541513 541519 5416 54161 541611 541612 541613 541614 541618 54162 541620 54169 541690 5417 54171 541713 541714 541715 54172 541720 5611 56111 561110 5612 56121 561210 5613 5614 56141 561410 56142 561421 561422 56143 561431 561439';

  //set myClassCode string object to identify the classification codes I care about
  const myClassStr = 'A B D R';

  //set regular expression to find 'sole.source' and 'set.aside' in the description
  const soleSource = RegExp('sole.source','i');
  const setAside = RegExp('set.aside','i');

  // if it's an opportunity type I don't care about, omit record and return
  if (myDealType.match(Object.keys(element[0])[0]) == null) {
    return false;
    };

  //if subject or description keys don't exist, omit record and return
  if (!("DESC" in element[0][Object.keys(element[0])[0]])  ||
      !("SUBJECT" in element[0][Object.keys(element[0])[0]])) {
        return false;
    };

  //Test if NAICS key exists, filter on it.  Return if not interesting result
  if ("NAICS" in element[0][Object.keys(element[0])[0]]) {  //if NAICS key exists
    if (myNaicsStr.match(element[0][Object.keys(element[0])[0]]['NAICS']) == null) {
      return false;  //NAICS exists but not interesting, omit record
    };
  };

  //Test if CLASSCOD key exists, filter on it.  Omit if not services deal
  if ("CLASSCOD" in element[0][Object.keys(element[0])[0]]) {  //if CLASSCOD key exists
    if (myClassStr.match(element[0][Object.keys(element[0])[0]]['CLASSCOD']) == null) {
      return false;  //CLASSCOD exists but not interesting, omit record
    };
  };

  //Test if SETASIDE key exists, filter on it.  Omit if SETASIDE deal
  if ("SETASIDE" in element[0][Object.keys(element[0])[0]]) {  //if SETASIDE key exists
    if ((element[0][Object.keys(element[0])[0]]['SETASIDE']) != 'N/A') {
      return false;  //SETASIDE exists and has a set aside type, omit record
    };
  };

  //Also check whether the description calls this opportunity sole source
  if (soleSource.test(element[0][Object.keys(element[0])[0]]['DESC'])) {
      return false;  //sole source, omit record
    };

   //Also check whether the description calls this opportunity sole source
  if (setAside.test(element[0][Object.keys(element[0])[0]]['DESC'])) {
      return false;  //set aside, omit record
    };

  //Passed all tests, keep the record
  return true;

};


//set starting date to the first date for which I have a file


  //Create array of text objects to store corpus text
  var myCorpus = {
    PRESOL:   [''],
    SRCSGT:   [''],
    COMBINE:  [''],
  };

// For loop over all files (assumes I have every day in the date range), process and then add output array to master to be written to the output files
var date = new Date('November 19, 2017'),
d = date.getDate(),
m = date.getMonth(), //January is momth 0 in JavaScripty = date.getFullYear();
y = date.getFullYear();

for (var i=0; i < 5; i++) {
  var curdate = new Date(y, m, d+i);
  var curMonth = ("0" + (curdate.getMonth()+1)).slice(-2); //increment month by 1, add leading zero if month 1-9
  var curDay = ("0" + curdate.getDate()).slice(-2); //add leading zero if  day 1-9

  //Read JSON file and create dailyOpps object.
  var dateString = 'Input Files/FBOFeed' + curdate.getFullYear() + curMonth + curDay;
  console.log(dateString);

    var dailyOpps = parser.parse(fs.readFileSync(dateString, 'UTF-8'));
    console.log('Number of JSON records in the input file: ', dailyOpps.length);

    //Filter dailyOpps to remove poorly formed or uninteresting opportunities
    var result = dailyOpps.filter(isInteresting);
    console.log('Number of JSON records through the filter: ', result.length);

    //Create corpus text by opportunity status.  Extract the title and description text
    // to build topic model training files
    result.forEach(function(element) {
      myCorpus[Object.keys(element[0])[0]] += 'SUBJECT ' + element[0][Object.keys(element[0])[0]]['SUBJECT'] + element[0][Object.keys(element[0])[0]]['DESC'];
    });

//End for loop over all Files
};

//write out title and description fields by sentence (topic model training)
  fs.writeFileSync('Output Files/Matt_Test_PRESOL.txt', myCorpus.PRESOL);
  fs.writeFileSync('Output Files/Matt_Test_SRCSGT.txt', myCorpus.SRCSGT);
  fs.writeFileSync('Output Files/Matt_Test_COMBINE.txt', myCorpus.COMBINE);

//write out title and description fields by sentence (topic model training)
//  fs.write('Output Files/Matt_Test_PRESOL.csv', myCorpus.PRESOL, 'a');
//  fs.write('Output Files/Matt_Test_SRCSGT.csv', myCorpus.SRCSGT, 'a');
//  fs.write('Output Files/Matt_Test_COMBINE.csv', myCorpus.COMBINE, 'a');

  //write out master array of objects to JSON files - last file only?
  fs.writeFileSync('Output Files/Matt_Test.json', JSON.stringify(result));
