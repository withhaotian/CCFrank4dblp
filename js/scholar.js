/**
 * MIT License
 *
 * Copyright (c) 2019-2023 WenyanLiu (https://github.com/WenyanLiu/CCFrank4dblp)
 */

const scholar = {};

scholar.rankSpanList = [];

scholar.run = function () {
    let url = window.location.pathname;
    if (url == "/scholar") {
        scholar.appendRank();
    } else if (url == "/citations") {
        setInterval(function () {
            $(window).bind("popstate", function () {
                scholar.appendRanks();
            });
            scholar.appendRanks();
        }, 2000);
    }
};

scholar.appendRank = function () {
    let elements = $("#gs_res_ccl_mid > div > div.gs_ri");
    elements.each(function () {
        let node = $(this).find("h3 > a");
        // console.log(node);
        if (!node.next().hasClass("ccf-rank")) {
            let title = node.text();
            console.log(title);
            let data = $(this)
                .find("div.gs_a")
                .text()
                // .replace(/[\,\-\…]/g, "")
                .replace(/[\,\…]/g, "")
                .split(" ");
            // console.log(data);
            let author = data[1];
            let year = data.slice(-3)[0];
            fetchRank(node, title, author, year, scholar);

            let source = $(this)
                .find("div.gs_a")
                .text()
                .split("-");
            let jour_conf = source[1];
            if(jour_conf.includes('\…')) {
                jour_conf = jour_conf.split('\…')[0];
            }
            if(jour_conf.includes('\,')) {
                jour_conf = jour_conf.split('\,')[0];
            }
            jour_conf = jour_conf.replace(/^\s+|\s+$/g, '');        // replace additional space
            console.log(jour_conf);
            for (let getRankSpan of scholar.rankSpanList) {
                if (jour_conf.includes('(')) {
                    jour_conf = jour_conf.substring(jour_conf.indexOf('(') + 1, jour_conf.indexOf(')'));
                }
                if (jour_conf.includes('\'')) {
                    jour_conf = jour_conf.substring(0, jour_conf.indexOf('\'')).trim();
                }
                // console.log(jour_conf)
                node.after(getRankSpan(jour_conf, 'blur'));
            }
        }
    });
};

scholar.appendRanks = function () {
    let elements = $("tr.gsc_a_tr");
    elements.each(function () {
        let node = $(this).find("td.gsc_a_t > a").first();
        if (!node.next().hasClass("ccf-rank")) {
            let title = node.text();
            let author = $(this)
                .find("div.gs_gray")
                .text()
                .replace(/[\,\…]/g, "")
                .split(" ")[1];
            let year = $(this).find("td.gsc_a_y").text();
            fetchRank(node, title, author, year, scholar);

            let source = $(this)
                .find("div.gs_gray")
                .text()
            console.log(source)
        }
    });
};