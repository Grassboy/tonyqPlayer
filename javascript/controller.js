$.when(
    $.getScript('javascript/config.js')
).then(function(){
    var myFirebaseRef = new Firebase(firebase_conf.server);      //Firebase 的同步連線物件
    var tmpstr = `
請問各為獅女...該衝??還是已宣告出局...
獅女心情不好 兩個月都不說話 我該怎麼辦
獅女其實很透明
獅子女友一直向我要家用電話
沒有獅女的─MSN交談篇....求救
如何知道獅子女孩喜歡你?
關於獅女友的無名
獅女友生氣了...
獅女的態度
獅女的愛情路
秤男追獅女
♀獅子女 v.s.射手男♂
獅王們的女友星座調查結果
獅男攻掠雙女心得
[金星女王]獅子座是王子麵 By夏霏
獅女必殺技
0808 kukki192000 小女人獅子座
每次買生日蛋糕都可以打折的貓女
0726獅子女
07.26 sawncp 標準獅女
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
            var track, is_odd;
            //find basic track
            track = this.isAvailableIn(this.basic_track_num, now);

            if(track < 0) //find turbo if not got available track
                track = this.isAvailableIn(this.turbo_track_num, now);

            if(track < 0) //find turbo2 if not got available track
                track = this.isAvailableIn(this.turbo2_track_num, now);

            //update next available time
            this.tracks[track] = (nexttime > this.tracks[track])?nexttime:this.tracks[track];

            is_odd = $('track-'+track+':last').is('odd'); //確保同個 track 連續兩則訊息的顏色不同
            item.addClass('track-'+track).addClass('fade-left').addClass('color-'+(((Math.random()*5)^0)+1));

        }
    };
    var trackManager = new TrackManager();

    var Logger = function(){
        var key = 'TonyQPlayer.browser_id', group_name = 'g'+(new Date()).getTime();
        var storage = localStorage[key] = localStorage[key] || 'b'+((Math.random()*10000000)^0);
        this.log_path = `${firebase_conf.log}${storage}/${group_name}/`;
        this.count = 0;
    };
    Logger.prototype = {
        constructor: Logger,
        addLog: function(type, args){
            //type may be: init, play, pause, msg;
            args = args || '';
            var time = (new Date()).getTime();
            myFirebaseRef.child(this.log_path).push({type, args, time});
            this.count++;
            if(this.count > 1) {
                history.pushState(null, null, 'index.html?v='+this.log_path);
            }
        }
    };
    var logger = new Logger();
    logger.addLog('init');
    $('body').bind('dblclick', function(){
        var length = ((Math.random()*50)^0)+3;
        var str = tmpstr.substr(((Math.random()*(tmpstr.length - length))^0), length);
        handleMsg(str);
    });
    $('.msglist').bind('transitionend', function(e){
        $(e.target).remove();
    });
    $('.play-icon').bind('click', function(){
        var $this = $(this), video = $('video')[0];
        if($this.is('.playing.hover')) {
            $this.removeClass('playing').removeClass('hover');
            video.pause();
            logger.addLog('pause');
        } else if($this.is('.playing')) {
            $this.addClass('hover');
        } else {
            var container = $('body')[0];
            container.requestFullScreen && container.requestFullScreen() ||
            container.webkitRequestFullScreen && container.webkitRequestFullScreen() ||
            container.mozRequestFullScreen && container.mozRequestFullScreen();
            $this.addClass('playing');
            video.play();
            logger.addLog('play');
        }
    });
    var handleMsg = function(msg){
        switch(msg) {
        case "#cat1": case "#cat2": case "#cat3": case "#cat4":
        case "#melody1": case "#melody2": case "#heart":
            var item = $('<div class="msg"></div>').addClass(msg.substr(1)).addClass('animate'+(1+((Math.random()*4)^0))).appendTo('.msglist');
            var width = item.width();
            break;
        default:
            var item = $('<div class="msg nowrap"><span></span></div>').appendTo('.msglist');
            item.find('span').text(msg);
            var width = item.find('span').width();
            item.removeClass('nowrap').width(width).text(msg);
        }
        trackManager.addToTrack(item, (new Date()).getTime()+((width*1000/velocity)^0));
        logger.addLog('msg', msg);
    };
    (function initFirebase(){
        myFirebaseRef.child(firebase_conf.listen).remove(function(error){
            if(!error) {
                myFirebaseRef.child(firebase_conf.listen).on("child_added", function(snapshot) {
                    var value = snapshot.val();
                    handleMsg(value.msg);
                });
            }
        });
    })();

});

