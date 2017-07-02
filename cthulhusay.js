/* 

R'lyehian language generator.  The one and only cthulhu-fhtagn-ator.

Copyright 2017 Davide Alberani <da@erlug.linux.it>

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

// Summoned from https://www.yog-sothoth.com/wiki/index.php/R'lyehian
var WORDS = ["'ai", "'bthnk", "'fhalma", 'ah', 'athg', 'bug', "ch'", 'chtenff', 'ebumna', 'ee', 'ehye', 'ep', 'fhtagn',
         "fm'latgh", 'ftaghu', 'geb', 'gnaiih', "gof'nn", 'goka', 'gotha', "grah'n", "hafh'drn", 'hai', 'hlirgh',
         'hrii', 'hupadgh', 'ilyaa', "k'yarnak", 'kadishtu', "kn'a", "li'hee", 'llll', 'lloig', "lw'nafh", "mnahn'",
         "n'gha", "n'ghft", 'nglui', "nilgh'ri", 'nog', 'nw', 'ooboshu', "orr'e", 'phlegeth', "r'luh", 'ron', "s'uhn",
         "sgn'wahl", 'shagg', 'shogg', 'shtunggli', 'shugg', "sll'ha", "stell'bsna", "syha'h", 'tharanak', 'throd',
         'uaaah', "uh'e", 'uln', 'vulgtlagln', 'vulgtm', "wgah'n", "y'hah", 'ya', 'zhro'];

// I'm confident that we'll find other conjunctions
var CONJUNCTIONS = ['mg'];

var PREFIXES = ['c', "f'", "h'", 'na', 'nafl', 'ng', 'nnn', "ph'", 'y'];

var SUFFIXES = ['agl', 'nyth', 'og', 'or', 'oth', 'yar'];

var SENTENCE_ENDS = ['!', '?', '.', '.', '.'];
var PUNCTUATIONS = SENTENCE_ENDS.concat([',', ';']);

var _ = require('lodash');


function sampleMany(seq, freq) {
    seq = seq || [];
    freq = freq || 1;
    var selection = [];
    var howMany = Math.round(freq * seq.length);
    _.times(howMany, function() { selection.push(_.sample(seq)); });
    return selection;
}


/** Cthulhu says hi! **/
function cthulhu_say(opts) {
    opts = opts || {};
    var o = {
        words: 10,
        conjuncionsFreq: 0.2,
        prefixesFreq: 0.25,
        suffixesFreq: 0.25,
        pluralsFreq: 0.3,
        punctuationsFreq: 0.1
    }
    _.merge(o, opts);
    var _range = _.range(o.words);

    var sentence = [];
    _.times(o.words, function() { sentence.push(_.sample(WORDS)); });
    _.each(sampleMany(_range, o.pluralsFreq), function(val, idx) {
        sentence[val] = sentence[val] + sentence[val][sentence[val].length-1];
    });
    _.each(sampleMany(_range, o.prefixesFreq), function(val, idx) {
        sentence[val] = _.sample(PREFIXES) + sentence[val];
    });
    _.each(sampleMany(_range, o.suffixesFreq), function(val, idx) {
        sentence[val] = _.sample(SUFFIXES) + sentence[val];
    });
    _.each(sampleMany(_.range(1, o.words-1), o.conjuncionsFreq), function(val, idx) {
        sentence[val] = _.sample(CONJUNCTIONS);
    });
    _.each(sampleMany(_.range(1, o.words-1), o.punctuationsFreq), function(val, idx) {
        var punctuation = _.sample(PUNCTUATIONS);
        if (_.includes(PUNCTUATIONS, sentence[val][sentence[val].length-1]) || _.includes(CONJUNCTIONS, _.lowerCase(sentence[val]))) {
            return;
        }
        sentence[val] = sentence[val] + punctuation;
        if (_.includes(SENTENCE_ENDS, punctuation)) {
            sentence[val+1] = _.capitalize(sentence[val+1]);
        }
    });

    var sentenceText = _.join(sentence, ' ');
    if (sentenceText) {
        sentenceText = _.upperFirst(sentenceText);
        if (o.punctuationsFreq) {
            sentenceText = sentenceText + _.sample(SENTENCE_ENDS);
        }
    }
    return sentenceText;
}


module.exports.cthulhu_say = cthulhu_say;


if (require.main === module) {
    console.log(cthulhu_say());
}
