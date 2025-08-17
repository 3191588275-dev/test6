"use strict";
var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
    return typeof t
} : function(t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
};

function _toConsumableArray(t) {
    if (Array.isArray(t)) {
        for (var n = 0, e = Array(t.length); n < t.length; n++) e[n] = t[n];
        return e
    }
    return Array.from(t)
}! function() {
    var t = "author",
        n = "me";
    new Vue({
        el: "#mobile",
        data: {
            messages: [],
            dialogs: null,
            lastDialog: null,
            msgChain: Promise.resolve(),
            isTyping: !1,
            nextTopics: [],
            hasPrompt: !1,
            latestMsgContent: null
        },
        mounted: function() {
            var t = this;
            $.getJSON("./assets/dialog.json", function(n) {
                t.dialogs = n, t.nextTopics = t.dialogs.fromUser, t.appendDialog("0000")
            })
        },
        methods: {
            appendDialog: function(n) {
                var o = this;
                if ("object" === (void 0 === n ? "undefined" : _typeof(n)) && n.length > 0) n.forEach(function(t) {
                    return o.appendDialog(t)
                });
                else {
                    if (null != n) {
                        this.isTyping = !0;
                        var i = this.getDialog(n);
                        return e(i.details).forEach(function(n) {
                            o.msgChain = o.msgChain.then(function() {
                                return r(700)
                            }).then(function() {
                                return o.sendMsg(n, t)
                            })
                        }), i.nextAuthor ? this.appendDialog(i.nextAuthor) : this.msgChain.then(function() {
                            o.lastDialog = i, o.isTyping = !1
                        })
                    }
                    this.lastDialog.responses = null
                }
            },
            sendMsg: function(t, n) {
                switch (n) {
                    case "me":
                        return this.sendUserMsg(t);
                    default:
                        return this.sendFriendMsg(t, n)
                }
            },
            sendFriendMsg: function(t, n) {
                var s = this,
                    a = e(t),
                    u = a.replace(/<[^>]+>/g, "").length,
                    l = /<img[^>]+>/.test(a),
                    h = u > 2 || l,
                    c = {
                        author: n,
                        content: h ? '\n        <div class="dot"></div>\n        <div class="dot"></div>\n        <div class="dot"></div>\n    ' : a,
                        isImg: l
                    };
                return this.messages.push(c), h ? (this.markMsgSize(c), setTimeout(i), r(Math.min(100 * u, 2e3)).then(function() {
                    return s.markMsgSize(c, a)
                }).then(function() {
                    return r(150)
                }).then(function() {
                    c.content = a, o()
                })) : (o(), Promise.resolve())
            },
            sendUserMsg: function(t) {
                return this.messages.push({
                    author: n,
                    content: t
                }), o(), Promise.resolve()
            },
            markMsgSize: function(t) {
                var n = this,
                    e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null;
                return this.latestMsgContent = e || t.content, r(0).then(function() {
                    return t.isImg && s($("#mock-msg img"))
                }).then(function() {
                    var e;
                    Object.assign(t, {
                        width: (e = $("#mock-msg")).width(),
                        height: e.height()
                    }), n.messages = [].concat(_toConsumableArray(n.messages))
                })
            },
            getDialog: function(t) {
                var n = this.dialogs.fromMe.filter(function(n) {
                    return n.id === t
                });
                return n ? n[0] : null
            },
            getDialogFromUser: function(t) {
                var n = this.dialogs.fromUser.filter(function(n) {
                    return n.id === t
                });
                return n ? n[0] : null
            },
            togglePrompt: function(t) {
                this.isTyping || (this.hasPrompt = t)
            },
            respond: function(t) {
                return this.say(t.content, t.nextAuthor)
            },
            ask: function(t) {
                var n = e(t.details);
                return this.say(n, t.nextAuthor)
            },
            say: function(t, e) {
                var o = this;
                return this.hasPrompt = !1, r(200).then(function() {
                    return o.sendMsg(t, n)
                }).then(function() {
                    return r(300)
                }).then(function() {
                    return o.appendDialog(e)
                }).then(function() {
        // ✅ 新增：如果是结尾 ID，则播放视频
			        if (Array.isArray(e) && e[0] === "end") {
			            o.playFinalVideo();
			        }
			    })
		    },
		    playFinalVideo: function() {
				  var overlay = document.getElementById("final-video-overlay");
				  var video = document.getElementById("final-video");
				  var bgm = document.getElementById("bgm");
				
				  // 暂停背景音乐
				  if (bgm && !bgm.paused) {
				    bgm.pause();
				  }
				
				  // 显示遮罩层
				  overlay.style.display = "block";
				  overlay.style.pointerEvents = "auto"; // ✅ 确保遮罩层可点击
				  document.body.style.pointerEvents = "auto"; // ✅ 恢复点击
				
				  // 创建提示
				  var tip = document.createElement("div");
				  tip.innerText = "点击任意位置播放视频";
				  tip.style.position = "absolute";
				  tip.style.top = "50%";
				  tip.style.left = "50%";
				  tip.style.transform = "translate(-50%, -50%)";
				  tip.style.color = "#fff";
				  tip.style.fontSize = "24px";
				  tip.style.zIndex = "10000";
				  overlay.appendChild(tip);
				
				  // ✅ 用户点击后播放视频
				  var playHandler = function() {
					  // ✅ 获取音乐播放器
					  var bgm = document.getElementById("bgm");
					  if (bgm && !bgm.paused) {
					    bgm.pause(); // ✅ 暂停背景音乐
					  }
					
					  video.muted = false;
					
					  if (video.readyState >= 2) {
					    video.play().then(function() {
					      tip.remove();
					    }).catch(function(err) {
					      console.error("播放失败：", err);
					    });
					  } else {
					    video.addEventListener("canplay", function() {
					      video.play().then(function() {
					        tip.remove();
					      }).catch(function(err) {
					        console.error("播放失败：", err);
					      });
					    });
					  }
					
					  document.body.removeEventListener("click", playHandler);
					};

				
				  document.body.addEventListener("click", playHandler);
				
				  // ✅ 播放完后关闭遮罩
				  video.onended = function() {
					  console.log("✅ 视频播放完毕，显示按钮");
					  const finalMessage = document.getElementById("final-message");
					  finalMessage.style.display = "block";
					  overlay.style.pointerEvents = "auto"; // 确保按钮可点击
					};

				}



            
        }
    });

    function e(t) {
        return "string" != typeof t && t.length ? t[Math.floor(Math.random() * t.length)] : t
    }

    function o() {
        setTimeout(function() {
            i();
            var t = $("#mobile-body-content .msg-row:last-child .msg");
            t.find("a").attr("target", "_blank"), s(t).then(i)
        })
    }

    function i() {
        var t = $("#mobile-body-content"),
            n = t[0].scrollHeight - t.height() - t.scrollTop(),
            e = Date.now();
        requestAnimationFrame(function o() {
            var i = Math.min(1, (Date.now() - e) / 250);
            t.scrollTop(t.scrollTop() + n * i), i < 1 && requestAnimationFrame(o)
        })
    }

    function r() {
        var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
        return new Promise(function(n) {
            setTimeout(n, t)
        })
    }

    function s(t) {
        return new Promise(function(n) {
            t.one("load", n).each(function(t, n) {
                n.complete && $(n).trigger("load")
            })
        })
    }
}();