/* Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. */

var fs = require("fs");
var parser = require("./index");

//filter out badly formed or uninteresting opportunities
function isInteresting(element) {

    //set myNaicsStr string object to identify the NAICS Codes I care about
    const myDealType = 'PRESOL SRCSGT COMBINE';

    //set myNaicsStr string object to identify the NAICS Codes I care about
    const myNaicsStr = '54133 541330 5415 54151 541511 541512 541513 541519 5416 54161 541611 541612 541613 541614 541618 54162 541620 54169 541690 5417 54171 541713 541714 541715 54172 541720 5611 56111 561110 5612 56121 561210 5613 5614 56141 561410 56142 561421 561422 56143 561431 561439';

    //set myClassCode string object to identify the classification codes I care about
    const myClassStr = 'A B D R';

    //set regular expression to find 'sole.source' and 'set.aside' in the description
    const soleSource = RegExp('sole.source', 'i');
    const setAside = RegExp('set.aside', 'i');

    // if it's an opportunity type I don't care about, omit record and return
    if (myDealType.match(Object.keys(element[0])[0]) == null) {
        return false;
    };

    //if subject or description keys don't exist, omit record and return
    if (!("DESC" in element[0][Object.keys(element[0])[0]]) ||
        !("SUBJECT" in element[0][Object.keys(element[0])[0]])) {
        return false;
    };

    //Test if NAICS key exists, filter on it.  Return if not interesting result
    if ("NAICS" in element[0][Object.keys(element[0])[0]]) { //if NAICS key exists
        if (myNaicsStr.match(element[0][Object.keys(element[0])[0]]['NAICS']) == null) {
            return false; //NAICS exists but not interesting, omit record
        };
    };

    //Test if CLASSCOD key exists, filter on it.  Omit if not services deal
    if ("CLASSCOD" in element[0][Object.keys(element[0])[0]]) { //if CLASSCOD key exists
        if (myClassStr.match(element[0][Object.keys(element[0])[0]]['CLASSCOD']) == null) {
            return false; //CLASSCOD exists but not interesting, omit record
        };
    };

    //Test if SETASIDE key exists, filter on it.  Omit if SETASIDE deal
    if ("SETASIDE" in element[0][Object.keys(element[0])[0]]) { //if SETASIDE key exists
        if ((element[0][Object.keys(element[0])[0]]['SETASIDE']) != 'N/A') {
            return false; //SETASIDE exists and has a set aside type, omit record
        };
    };

    //Also check whether the description calls this opportunity sole source
    if (soleSource.test(element[0][Object.keys(element[0])[0]]['DESC'])) {
        return false; //sole source, omit record
    };

    //Also check whether the description calls this opportunity sole source
    if (setAside.test(element[0][Object.keys(element[0])[0]]['DESC'])) {
        return false; //set aside, omit record
    };

    //Passed all tests, keep the record
    return true;

};

//set starting date to the first date for which I have a file


//Create array of text objects to store corpus text
var myCorpus = {
    PRESOL: [''],
    SRCSGT: [''],
    COMBINE: [''],
};

//JSON records from daily file
var dailyOpps = [];

//JSON records after filtering
var resultOutput = [];

//Read JSON file and create dailyOpps object.
var date = new Date('November 19, 2017'),
    d = date.getDate(),
    m = date.getMonth(), //January is momth 0 in JavaScripty = date.getFullYear();
    y = date.getFullYear();

// For loop over all files (assumes I have every day in the date range), process and then add output array to master to be written to the output files
for (var i = 0; i < 5; i++) {
    var curdate = new Date(y, m, d + i);
    var curMonth = ("0" + (curdate.getMonth() + 1)).slice(-2); //increment month by 1, add leading zero if month 1-9
    var curDay = ("0" + curdate.getDate()).slice(-2); //add leading zero if  day 1-9

    //Read JSON file and create dailyOpps object.
    var dateString = 'Input Files/FBOFeed' + curdate.getFullYear() + curMonth + curDay;
    console.log(dateString);

    var dailyOpps = parser.parse(fs.readFileSync(dateString, 'UTF-8'));
    console.log('Number of JSON records in the input file: ', dailyOpps.length);

    //Filter dailyOpps to remove poorly formed or uninteresting opportunities
    var result = dailyOpps.filter(isInteresting);
    console.log('Number of JSON records through the filter: ', result.length);

    //	var resultOutput.push(result);
    resultOutput = resultOutput.concat(result);

    //Create corpus text by opportunity status.  Extract the title and description text
    // to build topic model training files
    result.forEach(function(element) {
        myCorpus[Object.keys(element[0])[0]] += 'SUBJECTTAG ' + element[0][Object.keys(element[0])[0]]['SUBJECT'] + '\n' + element[0][Object.keys(element[0])[0]]['DESC'];
    });

    //End for loop over all Files
};

//write out title and description fields by sentence (topic model training)
fs.writeFileSync('Output Files/Matt_Test_PRESOL.txt', myCorpus.PRESOL);
fs.writeFileSync('Output Files/Matt_Test_SRCSGT.txt', myCorpus.SRCSGT);
fs.writeFileSync('Output Files/Matt_Test_COMBINE.txt', myCorpus.COMBINE);

//write out master array of objects to JSON files - last file only?
fs.writeFileSync('Output Files/Matt_Test.json', JSON.stringify(resultOutput));