var fs = require("fs");
var parser = require("./index");

fs.writeFileSync('Output Files/20181105.json', JSON.stringify(parser.parse(fs.readFileSync('Input Files/FBOFeed20181105', 'UTF-8'))));

// Matt's new code to test parser

//Read JSON file and create dailyOpps object.
var dailyOpps = parser.parse(fs.readFileSync('Input Files/FBOFeed20181105', 'UTF-8'));

// Set string of NAICS codes that I care about
var myNaicsStr = '54133 541330 5415 54151 541511 541512 541513 541519 5416 54161 541611 541612 541613 541614 541618 54162 541620 54169 541690 5417 54171 541713 541714 541715 54172 541720 5611 56111 561110 5612 56121 561210 5613 5614 56141 561410 56142 561421 561422 56143 561431 561439'

//show number of records in today's file on node console, and initialize goodDeals
console.log('number of records in document is ', dailyOpps.length);
var goodDeals = dailyOpps.length;
var soleSource = RegExp('sole.source','i');

// Filter each record in today's file to find and write only the records I care about
for (var i=dailyOpps.length-1; i>=0; i--) {


  //get the update type so that I can do a switch statement (need )to learn how to reference on my own.
  var oppUpdateType = Object.keys(dailyOpps[i][0])[0];

  //Access NAICS code for each record type and keep record if NAICS code is valid.  Otherwise ignore the record.
  switch (oppUpdateType) {
    case 'PRESOL':
      //console.log('PRESOL, Record number ', i, 'NAICS ', dailyOpps[i][0].PRESOL.NAICS, 'Soln ', dailyOpps[i][0].PRESOL.SOLNBR);
      if ((myNaicsStr.match(dailyOpps[i][0].PRESOL.NAICS) == null)
      || (dailyOpps[i][0].PRESOL.SETASIDE != 'N/A') || (soleSource.test(dailyOpps[i][0].PRESOL.DESC))) {
        dailyOpps.splice(i, 1);
        goodDeals--;
        // console.log(dailyOpps[i]);
      }
      break;
    case 'SRCSGT':
    //console.log('SRCSGT, Record number ', i, 'NAICS ', dailyOpps[i][0].SRCSGT.NAICS, 'Soln ', dailyOpps[i][0].SRCSGT.SOLNBR);
      if ((myNaicsStr.match(dailyOpps[i][0].SRCSGT.NAICS) == null)
      || (dailyOpps[i][0].SRCSGT.SETASIDE != 'N/A') || (soleSource.test(dailyOpps[i][0].SRCSGT.DESC))) {
        dailyOpps.splice(i, 1);
        goodDeals--;
        // console.log(dailyOpps[i]);
      }
      break;
    case 'SNOTE':
    //console.log('SNOTE, Record number ', i, 'NAICS ', dailyOpps[i][0].SNOTE.NAICS, 'Soln ', dailyOpps[i][0].SNOTE.SOLNBR);
      if ((myNaicsStr.match(dailyOpps[i][0].SNOTE.NAICS) == null)
      || (dailyOpps[i][0].SNOTE.SETASIDE != 'N/A') || (soleSource.test(dailyOpps[i][0].SNOTE.DESC))) {
        dailyOpps.splice(i, 1);
        goodDeals--;
        // console.log(dailyOpps[i]);
      }
      break;
    case 'COMBINE':
    //console.log('COMBINE, Record number ', i, 'NAICS ', dailyOpps[i][0].COMBINE.NAICS, 'Soln ', dailyOpps[i][0].COMBINE.SOLNBR);
      if ((myNaicsStr.match(dailyOpps[i][0].COMBINE.NAICS) == null)
      || (dailyOpps[i][0].COMBINE.SETASIDE != 'N/A') || (soleSource.test(dailyOpps[i][0].COMBINE.DESC))) {
        dailyOpps.splice(i, 1);
        goodDeals--;
      // console.log(dailyOpps[i]);
      }
      break;
    case 'AMDCSS':
    //console.log('AMDCSS, Record number ', i, 'NAICS ', dailyOpps[i][0].AMDCSS.NAICS, 'Soln ', dailyOpps[i][0].AMDCSS.SOLNBR);
      if ((myNaicsStr.match(dailyOpps[i][0].AMDCSS.NAICS) == null)
      || (dailyOpps[i][0].AMDCSS.SETASIDE != 'N/A') || (soleSource.test(dailyOpps[i][0].AMDCSS.DESC))) {
        dailyOpps.splice(i, 1);
        goodDeals--;
      // console.log(dailyOpps[i]);
      }
      break;
    case 'MOD':
    //console.log('MOD, Record number ', i, 'NAICS ', dailyOpps[i][0].MOD.NAICS, 'Soln ', dailyOpps[i][0].MOD.SOLNBR);
      if ((myNaicsStr.match(dailyOpps[i][0].MOD.NAICS) == null)
      || (dailyOpps[i][0].MOD.SETASIDE != 'N/A') || (soleSource.test(dailyOpps[i][0].MOD.DESC))) {
        dailyOpps.splice(i, 1);
        goodDeals--;
      // console.log(dailyOpps[i]);
      }
      break;
    case 'AWARD':
    //console.log('AWARD, Record number ', i, 'NAICS ', dailyOpps[i][0].AWARD.NAICS, 'Soln ', dailyOpps[i][0].AWARD.SOLNBR);
      if (myNaicsStr.match(dailyOpps[i][0].AWARD.NAICS) == null) {
        dailyOpps.splice(i, 1);
        goodDeals--;
        // console.log(dailyOpps[i]);
      }
      break;
    //No NAICS code, ignore
    case 'JA':
    case 'FAIROPP':
    case 'ARCHIVE':
    case 'UNARCHIVE':
    case 'CANCEL':
    case 'SSALE':
    case 'FSTD':
    case 'ITD':
    //console.log('ARCHIVE, Record number ', i, 'NAICS ', dailyOpps[i][0].ARCHIVE.NAICS, 'Soln ', dailyOpps[i][0].ARCHIVE.SOLNBR);
      //These don't have NAICS codes so ignore themn
      dailyOpps.splice(i, 1);
      goodDeals--;
    break;
    // Add new record type catcher at bottom of switch case.  If not a recognized case, alert the user so I can update code and handle new data type (e.g. CANCEL)
    default:
      console.log('Unrecognized record type included in output: ', oppUpdateType);
  }

} //end for loop

console.log('Normal completion, good deals = ', goodDeals);

fs.writeFileSync('Output Files/Matt_Test_20181105.json', JSON.stringify(dailyOpps));
