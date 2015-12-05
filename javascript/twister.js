$(function(){
    var mousedown = 'mousedown', mouseup = 'mouseup';
    if(navigator.userAgent.indexOf('iPad') != -1) {
        mousedown = 'touchstart';
        mouseup = 'touchend';
    }
    var start_time;
    var is_black;
    var shuffle_array = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
    var black_box = [
        [ {my:'左腳', to: 1}, {my:'右腳', to: 16}, {my:'右膝', to: 7} ],
        [ {my:'左手肘', to: 3}, {my:'右手肘', to: 2}, {my:'右膝', to: 10}, {my:'左膝', to: 11} ],
        [ {my:'左腳', to: 8}, {my:'右腳', to: 8}, {my:'左手', to: 8}, {my:'右手', to: 8}],
        [ {my:'右腳', to: 4}, {my:'左腳', to: 16}, {my:'右肩', to: 10}, {my:'右手', to: 5}],
        [ {my:'屁股', to: 14}, {my:'右腳', to: 10}, {my:'左腳', to: 15}, {my:'右手', to: 11}],
        [ {my:'屁股', to: 11}],
        [ {my:'左腳', to: 12}, {my:'右腳', to: 9}, {my:'左手', to: 12}, {my:'右手', to: 9}],
        [ {my:'左腳', to: 16}, {my:'屁股', to: 15}, {my:'右腳', to: 1}, {my:'右手', to: 12}]
    ];
    var black_black_box = [
        [
            {my:'左腳', to: 3},
            {my:'右腳尖', to: 14},
            {my:'右膝', to: 6}
        ]
    ];
    var tick_timer;
    var rand = function(){return Math.random()>0.5?1:-1};
    var tick = function(){
        shuffle_array.sort(rand);
        $('.board').find('.here').removeClass('here');
        $('.item').eq(shuffle_array[0]).addClass('here');
        $('.item').eq(shuffle_array[1]).addClass('here');
        $('.item').eq(shuffle_array[2]).addClass('here');
        $('.item').eq(shuffle_array[3]).addClass('here');
        $('.cat1').attr('data-pos', shuffle_array[0]);
        $('.cat2').attr('data-pos', shuffle_array[1]);
        $('.cat3').attr('data-pos', shuffle_array[2]);
        $('.cat4').attr('data-pos', shuffle_array[3]);
    };
    var randomPick = function(){
        var left_top = ['左手掌', '左手肘', '左肩'];
        var right_top = ['右手掌', '右手肘', '右臉'];
        var left_bottom = ['左腳', '左膝'];
        var right_bottom = ['右腳', '右膝', '右邊屁股'];
        left_top.sort(rand);
        right_top.sort(rand);
        left_bottom.sort(rand);
        right_bottom.sort(rand);
        setResult([
            {my: left_top[0], to: shuffle_array[0]},
            {my: left_bottom[0], to: shuffle_array[1]},
            {my: right_top[0], to: shuffle_array[2]},
            {my: right_bottom[0], to: shuffle_array[3]},
        ]);
    };
    var setResult = function(result) {
        // [{to: 3, my: '左手'}]
        var i, n;
        for(i = 0, n = result.length; i < n; ++i){
            var item = result[i];
            $('.item[data-pos="'+item.to+'"]').addClass('here');
            $('.cat'+(i+1)).attr('data-pos', item.to).attr('data-what', item.my);
        }
        if(i < 4) {
            for(i = i; i < 4; ++i){
                $('.cat'+(i+1)).attr('data-pos', null).attr('data-what', null);
            }
        }
        $('.container').removeClass('drawing').addClass('drawend');
    };
    $('.logo2').bind('click', function(){
        document.body.requestFullScreen || document.body.requestFullScreen();
        document.body.mozRequestFullScreen || document.body.mozRequestFullScreen();
        document.body.webkitRequestFullScreen || document.body.webkitRequestFullScreen();
    });
    $('.slot').bind(mousedown, function(){
        if($('.container').is('.drawing')) {
            return;
        }
        if($('.container').is('.drawend')) {
            return;
        }
        is_black = false;
        start_time = (new Date()).getTime();
        $('.container').addClass('touchstart');
    }).bind(mouseup, function(){
        if($('.container').is('.drawing')) {
            return;
        }
        if($('.container').is('.drawend')) {
            $('.container').removeClass('drawend');
            $('.cat').attr({
                'data-pos': null,
                'data-what': null
            });
            return;
        }
        var now = (new Date()).getTime();
        $('.container').removeClass('touchstart');
        if(now-start_time > 3000) {
            is_black = true;
        }
        $('.container').addClass('drawing');
        clearInterval(tick_timer);
        tick();
        tick_timer = setInterval(tick, 100);
        setTimeout(function(){
            $('.here').removeClass('here');
            clearInterval(tick_timer);
            setTimeout(function(){
                if(is_black) {
                    setResult(black_black_box[0]);
                } else {
                    if(black_box.length != 0) {
                        black_box.sort(rand);
                        setResult(black_box[0]);
                        black_box.splice(0,1);
                    } else {
                        randomPick();
                    }
                }
            },100);
        }, 3000);
    });
    var top_cat = 0;
    setInterval(function(){
        $('.active').removeClass('active');
        $('.cat').eq(top_cat).addClass('active');
        top_cat = (top_cat+1)%4;
    }, 1000);
});
