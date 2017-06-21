/**
 * Created by CodingMaster on 2017/6/19.
 */

var elements = {
    aPages: null,
    welcome: {
        "oWelcome": null,
        "aWelcomeSpan": null,
        "oArrow": null,
        "oUnderline": null,
        "oRobot": null
    },
    home: {
        "oHome": null,
        "oHeader": null,
        "oContent": null,
        "oFooter": null,
        "oLeftArrow": null,
        "oRightArrow": null,
        "oMainContent": null
    },
    about: {
        "oAbout": null,
        "oHeader": null,
        "oContent": null,
        "oFooter": null,
        "oLeftArrow": null,
        "oRightArrow": null,
        "oMainContent": null
    },
    contact: {
        "oContact": null,
        "oHeader": null,
        "oContent": null,
        "oFooter": null,
        "oLeftArrow": null,
        "oRightArrow": null,
        "oMainContent": null
    },
    aPanels: null,
    backScreen: null,
    aP1Divs: null,
    aP2Nodes: null,
    aP3Nodes: null
};

var bLoadedWelcome = false;

window.onload = function () {
    initialElements();
    setP1Node();
    setP2Node();
    setP3Node();
    welcomeAnimation();
    bindKeyDown();

    showPageFromHash(location.hash);
    if (location.hash !== "") {
        document.removeEventListener("keydown", bindWelcome);
    }

};

function initialElements() {
    window.addEventListener("hashchange", showPageFromHash);
    // all page
    elements.aPages = document.getElementsByClassName("page");
    // welcome page
    elements.welcome.oWelcome = document.getElementsByClassName("welcome")[0];
    //create spans with every char and assign to elements.aWelcomeSpan
    var aSpans = elements.welcome.oWelcome.getElementsByTagName("span");
    var len = aSpans.length;
    for (var i = 0; i < len; i++) {
        var text = aSpans[0].textContent;
        elements.welcome.oWelcome.removeChild(aSpans[0]);
        for (var c in text) {
            var tempSpan = document.createElement("span");
            tempSpan.appendChild(document.createTextNode(text[c]));
            elements.welcome.oWelcome.appendChild(tempSpan);
        }
        if (i !== len - 1) {
            elements.welcome.oWelcome.appendChild(document.createElement("br"));
        }
    }
    elements.welcome.aWelcomeSpan = elements.welcome.oWelcome.getElementsByTagName("span");
    //create underline
    elements.welcome.oUnderline = document.createElement("span");
    elements.welcome.oUnderline.appendChild(document.createTextNode("_"));
    //arrow
    elements.welcome.oArrow = elements.welcome.oWelcome.getElementsByClassName("arrow")[0];
    //robot
    elements.welcome.oRobot = document.getElementsByClassName("robot")[0];
    elements.welcome.oRobot.getElementsByTagName("img")[0].addEventListener("click", function () {
        document.removeEventListener("keydown", bindWelcome);
        TweenMax.to(elements.aPages[0], .5, {
            css: {scale: 0.1, rotation: 720}, ease: Power2.easeIn, onComplete: function () {
                bLoadedWelcome = true;
                showPage(1);
            }
        });
    });
    elements.welcome.oRobot.getElementsByTagName("img")[0].addEventListener("mouseenter", function () {
        this.src = "assets/img/robot2.png";
        this.addEventListener("mouseleave", f);
        function f() {
            this.src = "assets/img/robot.png";
            this.removeEventListener("mouseleave", f);
        }
    });
    // home page
    elements.home.oHome = document.getElementsByClassName("home")[0];
    elements.home.oHeader = elements.home.oHome.getElementsByTagName("div")[0];
    elements.home.oContent = elements.home.oHome.getElementsByTagName("div")[1];
    elements.home.oFooter = elements.home.oHome.getElementsByTagName("div")[2];
    elements.home.oLeftArrow = elements.home.oContent.getElementsByClassName("leftArrow")[0];
    elements.home.oRightArrow = elements.home.oContent.getElementsByClassName("rightArrow")[0];
    elements.home.oMainContent = elements.home.oContent.getElementsByClassName("mainContent")[0];

    // about page
    elements.about.oAbout = document.getElementsByClassName("about")[0];
    elements.about.oHeader = elements.about.oAbout.getElementsByTagName("div")[0];
    elements.about.oContent = elements.about.oAbout.getElementsByTagName("div")[1];
    elements.about.oFooter = elements.about.oAbout.getElementsByTagName("div")[2];
    elements.about.oLeftArrow = elements.about.oContent.getElementsByClassName("leftArrow")[0];
    elements.about.oRightArrow = elements.about.oContent.getElementsByClassName("rightArrow")[0];
    elements.about.oMainContent = elements.about.oContent.getElementsByClassName("mainContent")[0];

    //contact page
    elements.contact.oContact = document.getElementsByClassName("contact")[0];
    elements.contact.oHeader = elements.contact.oContact.getElementsByTagName("div")[0];
    elements.contact.oContent = elements.contact.oContact.getElementsByTagName("div")[1];
    elements.contact.oFooter = elements.contact.oContact.getElementsByTagName("div")[2];
    elements.contact.oLeftArrow = elements.contact.oContent.getElementsByClassName("leftArrow")[0];
    elements.contact.oRightArrow = elements.contact.oContent.getElementsByClassName("rightArrow")[0];
    elements.contact.oMainContent = elements.contact.oContent.getElementsByClassName("mainContent")[0];

    //bind arrow listener animation
    elements.home.oLeftArrow.addEventListener("mouseenter", arrowEnterAnimation.bind(null, elements.home.oLeftArrow));
    elements.home.oLeftArrow.addEventListener("mouseleave", arrowLeaveAnimation.bind(null, elements.home.oLeftArrow));
    elements.home.oRightArrow.addEventListener("mouseenter", arrowEnterAnimation.bind(null, elements.home.oRightArrow));
    elements.home.oRightArrow.addEventListener("mouseleave", arrowLeaveAnimation.bind(null, elements.home.oRightArrow));
    elements.home.oMainContent.addEventListener("mouseenter", arrowEnterAnimation.bind(null, elements.home.oMainContent));
    elements.home.oMainContent.addEventListener("mouseleave", arrowLeaveAnimation.bind(null, elements.home.oMainContent));
    elements.about.oLeftArrow.addEventListener("mouseenter", arrowEnterAnimation.bind(null, elements.about.oLeftArrow));
    elements.about.oLeftArrow.addEventListener("mouseleave", arrowLeaveAnimation.bind(null, elements.about.oLeftArrow));
    elements.about.oRightArrow.addEventListener("mouseenter", arrowEnterAnimation.bind(null, elements.about.oRightArrow));
    elements.about.oRightArrow.addEventListener("mouseleave", arrowLeaveAnimation.bind(null, elements.about.oRightArrow));
    elements.about.oMainContent.addEventListener("mouseenter", arrowEnterAnimation.bind(null, elements.about.oMainContent));
    elements.about.oMainContent.addEventListener("mouseleave", arrowLeaveAnimation.bind(null, elements.about.oMainContent));
    elements.contact.oLeftArrow.addEventListener("mouseenter", arrowEnterAnimation.bind(null, elements.contact.oLeftArrow));
    elements.contact.oLeftArrow.addEventListener("mouseleave", arrowLeaveAnimation.bind(null, elements.contact.oLeftArrow));
    elements.contact.oRightArrow.addEventListener("mouseenter", arrowEnterAnimation.bind(null, elements.contact.oRightArrow));
    elements.contact.oRightArrow.addEventListener("mouseleave", arrowLeaveAnimation.bind(null, elements.contact.oRightArrow));
    elements.contact.oMainContent.addEventListener("mouseenter", arrowEnterAnimation.bind(null, elements.contact.oMainContent));
    elements.contact.oMainContent.addEventListener("mouseleave", arrowLeaveAnimation.bind(null, elements.contact.oMainContent));

    function arrowEnterAnimation(e) {
        TweenMax.to(e, .5, {css: {scale: 1.2}, ease: Elastic.easeOut});
    }

    function arrowLeaveAnimation(e) {
        TweenMax.to(e, .5, {css: {scale: 1}, ease: Elastic.easeOut});
    }

    //panels
    elements.aPanels = document.getElementsByClassName("panel");
    //backScreen
    elements.backScreen = document.getElementsByClassName("backScreen")[0];


}

function welcomeAnimation() {
    var myTimeline = new TimelineMax();
    myTimeline.staggerFromTo(elements.welcome.aWelcomeSpan, .1, {autoAlpha: 0.01}, {autoAlpha: 1}, .05, null, function () {
        elements.welcome.oWelcome.appendChild(elements.welcome.oUnderline);
        TweenMax.fromTo(elements.welcome.oUnderline, 1, {autoAlpha: 0.01}, {
            autoAlpha: 1,
            repeat: -1,
            ease: Power0.easeNone
        });
    });
    TweenMax.to(elements.welcome.oArrow, 1, {y: 10, repeat: -1});
}

function bindKeyDown() {
    document.addEventListener("keydown", bindWelcome);
}
function bindWelcome(e) {
    // console.log(e.keyCode);
    if (e.keyCode === 13) {
        document.removeEventListener("keydown", bindWelcome);
        TweenMax.to(elements.aPages[0], .5, {
            css: {scale: 0.1, rotation: 720}, ease: Power2.easeIn, onComplete: function () {
                bLoadedWelcome = true;
                showPage(1);
            }
        });
    } else if (e.keyCode === 8) {
        var n = elements.welcome.oUnderline.previousElementSibling;
        if (n && (n.tagName === "SPAN" || n.tagName === "BR")) {
            elements.welcome.oWelcome.removeChild(n);
        }
    } else {
        var tempC = document.createElement("span");
        tempC.appendChild(document.createTextNode(String.fromCharCode(e.keyCode)));
        if (elements.welcome.oUnderline.parentNode === elements.welcome.oWelcome) {
            elements.welcome.oWelcome.insertBefore(tempC, elements.welcome.oUnderline);
        }
    }
}

function showPage(index) {
    switch (index) {
        case 1:
            location.hash = "home";
            break;
        case 2:
            location.hash = "about";
            break;
        case 3:
            location.hash = "contact";
            break;
    }

    for (var q = 0; q < elements.aPages.length; q++) {
        if (q !== 0) {
            var t = new TimelineMax();
            var a = [];
            var h = elements.aPages[q].getElementsByClassName("header")[0];
            var hs = h.getElementsByTagName("span");
            for (var si = 0; si < hs.length; si++) {
                a.push(hs[si]);
            }
            var c = elements.aPages[q].getElementsByClassName("content")[0];
            var f = elements.aPages[q].getElementsByClassName("footer")[0];
            a.push(h);
            a.push(c);
            a.push(f);
            t.set(a, {autoAlpha: 0.01});
            // console.log(a);
        }
        elements.aPages[q].classList.add("off");
    }

    elements.aPages[index].classList.remove("off");

    TweenMax.fromTo(elements.aPages[index], .2, {autoAlpha: 0.01}, {
        autoAlpha: 1, ease: Power2.easeIn, onComplete: function () {
            var h = elements.aPages[index].getElementsByClassName("header")[0];
            var c = elements.aPages[index].getElementsByClassName("content")[0];
            var f = elements.aPages[index].getElementsByClassName("footer")[0];
            // console.log(h);
            TweenMax.fromTo(h, .5, {left: "-100%", autoAlpha: 0.2}, {
                left: 0, autoAlpha: 1, ease: Power3.easeIn, onComplete: function () {
                    var ahs = h.getElementsByTagName("span");
                    var tlm = new TimelineMax();
                    tlm.staggerFromTo(ahs, .2, {autoAlpha: 0.01}, {autoAlpha: 1}, .1, null, function () {
                        TweenMax.fromTo(ahs[ahs.length - 1], 1, {autoAlpha: 0.01}, {
                            autoAlpha: 1,
                            repeat: -1,
                            ease: Power0.easeNone
                        });
                    });
                }
            });

            TweenMax.fromTo(c, .5, {autoAlpha: 0.5}, {
                autoAlpha: 1, ease: Power3.easeIn, onComplete: function () {
                    var e = c.getElementsByClassName("mainContent")[0];

                    mcAnimation();
                    function mcAnimation() {
                        TweenMax.to(e, function () {
                            return (((Math.random() * 0.5)) + 0.5).toFixed(2);
                        }(), {
                            x: function () {
                                return parseInt(Math.random() * 60) - 30;
                            }(), y: function () {
                                return parseInt(Math.random() * 40) - 20;
                            }, rotation: function () {
                                return parseInt(Math.random() * 120) - 60;
                            }(), onComplete: function () {
                                mcAnimation();
                            }
                        });
                    }

                    // var tm = new TweenMax({repeat:-1});
                    // tm.to(e,at,{x:mx,rotation:mr,onComplete:function () {
                    //     mx = parseInt(Math.random()*60) -30 ;
                    //     mr = parseInt(Math.random()*120) -60 ;
                    //     at = (((Math.random()*0.5)) +0.5).toFixed(2);
                    // }});


                }
            });
            TweenMax.fromTo(f, .5, {left: "100%", autoAlpha: 0.2}, {left: 0, autoAlpha: 1, ease: Power3.easeIn});

        }
    });
}

function showPageFromHash() {
    switch (location.hash) {
        case "":
            if (bLoadedWelcome) {
                location.hash = "#hash"
            }
            break;
        case "#home":
            showPage(1);
            break;
        case "#about":
            showPage(2);
            break;
        case "#contact":
            showPage(3);
            break;
        default:
            showPage(1);
            break;
    }
}

function showPanel(index) {
    var e = elements.aPanels[index];
    var b = elements.backScreen;
    e.classList.remove("off");
    b.classList.remove("off");
    if (index === 0) {
        TweenMax.fromTo(e, .2, {y: 20, autoAlpha: 0.01}, {
            y: 0, autoAlpha: 1, onComplete: function () {
                var t = new TimelineMax();
                t.staggerFromTo(elements.aP1Divs, .4, {
                    cycle: {x: [-100, 100], scale: [2, .5]},
                    autoAlpha: 0.01
                }, {x: 0, scale: 1, autoAlpha: 1, ease: Sine.easeOut}, .05);
            }
        });
    } else if (index === 1) {
        TweenMax.fromTo(e, .2, {y: 20, autoAlpha: 0.01}, {
            y: 0, autoAlpha: 1, onComplete: function () {
                var t = new TimelineMax();
                t.staggerFromTo(elements.aP2Nodes, .4, {y: 20, autoAlpha: 0.01}, {
                    y: 0,
                    autoAlpha: 1,
                    ease: Elastic.easeOut
                }, .1);
            }
        });
    } else if (index === 2) {
        // console.log(elements.aP3Nodes);
        TweenMax.fromTo(e, .2, {y: 20, autoAlpha: 0.01}, {
            y: 0, autoAlpha: 1, onComplete: function () {
                var t = new TimelineMax();
                t.staggerFromTo(elements.aP3Nodes, .4, {scale: .5, autoAlpha: 0.01}, {
                    scale: 1,
                    autoAlpha: 1,
                    ease: Elastic.easeOut
                }, .1);
            }
        });
    }
}

function showPanelOff() {
    for (var i = 0; i < elements.aPanels.length; i++) {
        if (!elements.aPanels[i].classList.contains("off")) {
            if (i === 0) {
                var t = new TimelineMax();
                t.set(elements.aP1Divs, {autoAlpha: 0.01});
            } else if (i === 1) {
                var t = new TimelineMax();
                t.set(elements.aP2Nodes, {autoAlpha: 0.01});
            } else if (i === 2){
                var t = new TimelineMax();
                t.set(elements.aP3Nodes, {autoAlpha: 0.01});
            }
            elements.aPanels[i].classList.add("off");
        }
    }
    elements.backScreen.classList.add("off");
}

function setP1Node() {
    elements.aP1Divs = [];
    var aImgs = elements.aPanels[0].getElementsByTagName("img");
    var aPs = elements.aPanels[0].getElementsByTagName("p");
    for (var i = 0; i < aImgs.length; i++) {
        if (i % 2 === 0) {
            elements.aP1Divs.push(aImgs[i].parentNode);
            elements.aP1Divs.push(aPs[i].parentNode);
        } else {
            elements.aP1Divs.push(aPs[i].parentNode);
            elements.aP1Divs.push(aImgs[i].parentNode);
        }
    }
}

function setP2Node() {
    elements.aP2Nodes = [];
    var aH1s = elements.aPanels[1].getElementsByTagName("h1");
    var aHrs = elements.aPanels[1].getElementsByTagName("hr");
    var aPs = elements.aPanels[1].getElementsByTagName("p");
    for (var i = 0; i < aH1s.length; i++) {
        elements.aP2Nodes.push(aH1s[i]);
        elements.aP2Nodes.push(aHrs[i]);
        elements.aP2Nodes.push(aPs[i]);
    }
}

function setP3Node() {
    elements.aP3Nodes = [];
    var aLabels = elements.aPanels[2].getElementsByTagName("label");
    var aInputs = elements.aPanels[2].getElementsByTagName("input");
    var oTextarea = elements.aPanels[2].getElementsByTagName("textarea")[0];
    var obutton = elements.aPanels[2].getElementsByTagName("button")[0];
    elements.aP3Nodes.push(aLabels[0]);
    elements.aP3Nodes.push(aInputs[0]);
    elements.aP3Nodes.push(aLabels[1]);
    elements.aP3Nodes.push(aInputs[1]);
    elements.aP3Nodes.push(aLabels[2]);
    elements.aP3Nodes.push(oTextarea);
    elements.aP3Nodes.push(obutton);

    obutton.addEventListener("click",function () {
        TweenMax.to(elements.aPanels[2],.5,{scale:.5,rotation:720,onComplete:function () {
            TweenMax.to(elements.aPanels[2],.5,{y:-1000,ease:Back.easeInOut,onComplete:function () {
                var t = new TimelineMax();
                t.set(elements.aPanels[2],{y:0,scale:1,rotation:0});
                aInputs[0].value = "";
                aInputs[1].value = "";
                oTextarea.value = "";
                showPanelOff(2);
            }});
        }});
    });
}




