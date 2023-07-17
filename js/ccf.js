/**
 * MIT License
 *
 * Copyright (c) 2019-2023 WenyanLiu (https://github.com/WenyanLiu/CCFrank4dblp), Kai Chen (https://github.com/FunClip)
 */

const ccf = {};

ccf.getRankInfo = function (refine, type) {
    let rankInfo = {};
    rankInfo.ranks = [];
    rankInfo.info = "";
    let rank;
    let url;
    if (type == "url") {
        rank = ccf.rankUrl[refine];
        url = refine;
    } else if (type == 'abbr') {
        // console.log(refine);
        let full = ccf.abbrFull[refine];
        // console.log(full);
        url = ccf.fullUrl[full];
        if (full === undefined) {
            refine = refine.substring(0, refine.length - 1);
            // console.log(refine.toUpperCase());
            var res = Object.keys(ccf.fullUrl).filter(function (k) {
                return k.indexOf(refine.toUpperCase()) == 0;
            });
            // console.log(res);
            url = res ? ccf.fullUrl[res] : false;
            // console.log(url);
        }
        rank = ccf.rankUrl[url];
    } else if (type == 'meeting') {
        let full = ccf.abbrFull[refine];
        url = ccf.fullUrl[full];
        rank = ccf.rankUrl[url];
    } else if(type == 'blur') {
        // console.log(refine);
        // blur search only for google scholar
        let findArr = [];
        // console.log(refine);
        Object.keys(ccf.fullUrl).filter(function (k) {
            // console.log(k);
            // console.log(refine);
            let res = k.indexOf(refine.toUpperCase());
            // console.log(res);
            if(res >= 0) {
                // console.log(ccf.fullUrl[k]);
                findArr.push(ccf.fullUrl[k]);
            }
        });
        // console.log(findArr);
        url = findArr[0];
        if (findArr.length == 0 || findArr.length > 1) {
            rank = undefined;
        } else {
            rank = ccf.rankUrl[url];
        }
        // console.log(rank);
    } else {
        url = ccf.fullUrl[refine];
        rank = ccf.rankUrl[url];
    }
    if (rank == undefined) {
        rank = "none";
        rankInfo.info += "Not Found\n";
    } else {
        rankInfo.info += ccf.rankFullName[url];
        let abbrname = ccf.rankAbbrName[url];
        if (abbrname != "") {
            rankInfo.info += " (" + abbrname + ")";
        }
        rankInfo.info += ": CCF " + rank + "\n";
    }
    rankInfo.ranks.push(rank);
    return rankInfo;
};

ccf.getRankClass = function (ranks) {
    for (let rank of "ABC") {
        for (let r of ranks) {
            if (r[0] == rank) {
                return "ccf-" + rank.toLowerCase();
            }
        }
    }
    return "ccf-none";
};

ccf.getRankSpan = function (refine, type) {
    let rankInfo = ccf.getRankInfo(refine, type);
    let span = $("<span>")
        .addClass("ccf-rank")
        .addClass(ccf.getRankClass(rankInfo.ranks))
        .text("CCF " + rankInfo.ranks.join("/"));
    if (rankInfo.info.length != 0) {
        span
            .addClass("ccf-tooltip")
            .append($("<pre>").addClass("ccf-tooltiptext").text(rankInfo.info));
    }
    return span;
};
