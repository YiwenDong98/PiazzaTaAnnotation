// ==UserScript==
// @name         Piazza TA annotation
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Show the TA that is suppose to answer a piazza question
// @author       YD
// @match        https://piazza.com/class/*
// @icon         https://www.google.com/s2/favicons?domain=piazza.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Edit this to match the ta and units for the course.
    const TAS = {
        'Max Zhang': 1,
        'Yaxin Cheng': 1,
        'Zhenyang Xu': 1,
        'Victor Tian': 1,
        'Yiwen Dong': 1,
    };

    let taList = [];
    for (const [ta, units] of Object.entries(TAS)) {
        for (let a=0; a < units; a++) {
            taList.push(ta);
        }
    }
    console.log("TAs: " + taList);

    let calculateAnsweringTA = function (postNum, taList) {
        return taList[postNum % taList.length];
    }

    let annotatePage = function() {
        let removeFirstAt = function (atStr) {
            return atStr.toString().substring(1);
        }

        const postNumNode = document.querySelector('#at_ref_top');
        if (postNumNode) {
            const answerTitleNode = document.querySelector('#i_answer div .post_title');
            if (answerTitleNode) {
                answerTitleNode.innerHTML = answerTitleNode.innerHTML + " (" + calculateAnsweringTA(removeFirstAt(postNumNode.innerHTML), taList) + "'s turn)"
            } else {
                console.log("Cannot find answer to annotate");
            }
        }
    };
    PEM.addLastListener("content", function (content) {
        console.log("updated content");
        setTimeout(annotatePage, 0);
    });

    document.addEventListener('keydown', function (event) {
        if (event.code == 'KeyF' &&
           event.altKey && event.ctrlKey) {
            console.log("Key refresh");
            annotatePage();
            event.preventDefault();
        }
    });
})();
