$.when(
    $.getScript('javascript/config.js')
).then(function(){
    var tmpstr = `
    現在有沒有自給自足的房子？
    王奕凱:蔣萬安完了,賄選事證明確!
    有沒有青眼白龍的卦
    有沒有磁磚爆裂的八卦
    有沒有基督教反同性戀的八卦?
    電機系學生少思想 李嗣涔擔憂
    噍吧哖園區揭幕 追悼義士
    臉書私訊揪團向朱立倫討黨產 警方找上門
    中山區復甦了嗎
    八里雙屍案／謝依涵暫逃死刑 發回更審
    送禮品供抽獎遭控賄選 蔣萬安發聲明喊冤
    王奕凱:蔣萬安完了,賄選事證明確!
    樓上太吵 大陸震樓神器治鄰居
    台灣心臟外科權威??
    小火鍋店的霸主!?
    208430 + 611/28 mithralin    R: [ＦＢ] 王奕凱:蔣萬安完了,賄選事證明確!
    【特企】哇！一堆妹呀！萬寶祿國際慈善1
    有沒有要怎麼給亂停車的三寶教訓的八卦?
    法官都吃哪牌油的八卦?
    `;
    tmpstr = tmpstr.replace(/[\s]/g, '');
    var tick = 30, velocity = 160;
    var TrackManager = function(){
        this.tracks = [];
        this.basic_track_num = 5;
        this.turbo_track_num = 10;
        this.turbo2_track_num = 18;
        this.next_track = 0;
        for(var i = 0; i < this.turbo2_track_num; i++) {
            this.tracks[i] = 0;
        }
    };
    TrackManager.prototype = {
        constructor: TrackManager,
        isAvailableIn: function(track_num, now){
            var best_min_time = (new Date()).getTime(), best_min_track = -1;
            var next_track = this.next_track;
            if(next_track > track_num) {
                next_track = 0;
            }
            for(var i = 0; i < track_num; i++){
                track = (i+next_track) % track_num;
                var available_time = this.tracks[track];
                if(now > available_time) {
                    this.next_track = (track+1) % track_num;
                    return track;
                } else if (available_time - now < best_min_time){
                    best_min_time = available_time - now;
                    best_min_track = track;
                }
            }
            if(track_num != this.turbo2_track_num) {
                return -1;
            } else {
                return best_min_track;
            }
        },
        addToTrack: function(item, nexttime){
            var now = (new Date()).getTime();
            var track;
            //find basic track
            track = this.isAvailableIn(this.basic_track_num, now);

            if(track < 0) //find turbo if not got available track
                track = this.isAvailableIn(this.turbo_track_num, now);

            if(track < 0) //find turbo2 if not got available track
                track = this.isAvailableIn(this.turbo2_track_num, now);

            //update next available time
            this.tracks[track] = (nexttime > this.tracks[track])?nexttime:this.tracks[track];

            item.addClass('track-'+track).addClass('fade-left');

        }
    };
    var trackManager = new TrackManager();
    $('body').on('click', '.msg', function(){
        $(this).css('left', '-400px');
    });
    $('.msglist').bind('dblclick', function(){
        var length = ((Math.random()*50)^0)+3;
        var str = tmpstr.substr(((Math.random()*(tmpstr.length - length))^0), length);
        var item = $('<div class="msg"></div>').text(str).appendTo('.msglist');
        var width = item.width();
        trackManager.addToTrack(item, (new Date()).getTime()+((width*1000/velocity)^0));
    }).bind('transitionend', function(e){
        $(e.target).remove();
    });
    (function initFirebase(){
        var myFirebaseRef;      //Firebase 的同步連線物件
        myFirebaseRef = new Firebase(firebase_conf.server);
        myFirebaseRef.child(firebase_conf.listen).remove(function(error){
            if(!error) {
                myFirebaseRef.child(firebase_conf.listen).on("child_added", function(snapshot) {
                    var value = snapshot.val();
                    var item = $('<div class="msg"></div>').text(value.msg).appendTo('.msglist');
                    var width = item.width();
                    trackManager.addToTrack(item, (new Date()).getTime()+((width*1000/velocity)^0));
                });
            }
        });
    })();

});
