
$(function(){
    // input password
    $('.input-wrap-pass button').on('click', function(e){
        var $wrap = $(this).closest('.input-wrap-pass');
        if(!$wrap.length) return;
        if($wrap.hasClass('show')){
            $wrap.find('input[type="text"]').attr("type", "password");
            $wrap.removeClass("show");
        }else {
            $wrap.find('input[type="password"]').attr("type", "text");
            $wrap.addClass("show");
        }
    });

    // input unit
    $('.input-wrap-number.unit input[type="text"]').on('change', function(e){
        $(this).val(addNumCommas($(this).val()));
    });

    // input counter
    $('input[data-minimum], input[data-maximum]').on('change', function(e){
        var $input = $(this);
        var minimum = $input.data("minimum") != undefined ? parseFloat($input.data("minimum")) : -Infinity;
        var maximum = $input.data("maximum") != undefined ? parseFloat($input.data("maximum")) : Infinity;
        var value = parseFloat($input.val());
        value = Math.min(Math.max(minimum, value), maximum);
        $input.val(value);
    });

    // input value change by amount
    $('[data-amount]').on('click', function(e){
        var amount = parseFloat($(this).data('amount'));
        var $input = $(this).closest('.input-wrap-number').find('input');
        var value = $input.val() || "0";
        value = parseFloat(value.split(",").join("")) + amount;
        $input.val(value).trigger('change');
    });

    // tab
    $('[role="tab"]').on('click', function(e){
        var $container = $(this).closest('.tab-container');
        var $tabs = $container.find('[role="tab"]');
        var $panels = $container.find('[role="tabpanel"]');
        var controls = $(this).attr('aria-controls');
        if($(this).attr('aria-selected') == 'true') return;

        $tabs.attr('aria-selected', 'false').filter('[aria-controls="'+controls+'"]').attr('aria-selected', 'true');
        $panels.removeClass('show').filter('[id="'+controls+'"]').addClass('show');
        e.preventDefault();
    });

    // layer
    $('[data-open-layer]').on('click', function(e){
        var layerName = $(this).attr('data-open-layer');
        var $tgLayer = $('[data-layer-name="'+layerName+'"]');
        if(!$tgLayer.hasClass('full')){
            $('[data-layer-name]').filter(':not(.full)').hide();
        }
        var $layers = $('[data-layer-name]');
        $layers.css('z-index', '1').filter('[data-layer-name="'+layerName+'"]').css('z-index', '100');

        $tgLayer.show();
    });
    $('[data-close-layer]').on('click', function(e){
        var layerName = $(this).attr('data-close-layer');
        var $tgLayer;
        if(layerName){
            $tgLayer = $('[data-layer-name="'+layerName+'"]');
        }else{
            $tgLayer = $(this).closest('.layer');
        }
        $tgLayer.hide();
    });
    
    // Gnb
    $('[data-open-util]').on('click', function(e){
        var layerName = $(this).attr('data-open-util');
        var $tgLayer = $('[data-layer-name="'+layerName+'"]');
        $tgLayer.addClass('show').show(0, function(){
            $(this).css('left', 0);
        });
        $('body').addClass('lock');
    });
    $('[data-close-util]').on('click', function(e){
        $tgLayer = $(this).closest('.layer');
        $tgLayer.attr('style', '').delay(400).hide(0, function(){
            $(this).removeClass('show');
            $('body').removeClass('lock');
        });
    });


    // Data Js Excute
    $('[data-js]').each(function(i, el){
        switch ($(this).attr('data-js')){
            case "checkEmpty" :
                checkEmpty(this);
                break;
        }
    });

    function checkEmpty(el){
        var $container = $(el);
        var $items = $container.find('[data-check-empty="item"]');
        var $action = $container.find('[data-check-empty="action"]');
        $items.on('keyup', function(e){
            isItemEmpty() ? $action.attr("disabled", true) : $action.attr("disabled", false);
        });
        function isItemEmpty(){
            var result = false;
            $items.each(function(i, el){
                if($(this).val() == ""){
                    result = true;
                }
            })
            return result;
        }
    }

    // window Fn
    window.openLayer = function(layerName){
        var $tgLayer = $('[data-layer-name="'+layerName+'"]');
        if(!$tgLayer.hasClass('full')){
            $('[data-layer-name]').filter(':not(.full)').hide();
        }
        $tgLayer.show();
    }
    window.closeLayer = function(layerName){
        $tgLayer = $('[data-layer-name="'+layerName+'"]');
        $tgLayer.hide();
    }

    /* UI-2 [s] */
    
    // 핸드폰번호 입력 여부 -> 인증번호 버튼 활성/비활성
    // $('[data-mobile-number]').on('keyup',function(){
    //     if( $(this).val().length === 0 ){
    //         $(this).parent().next().children('button').prop("disabled", true);
    //     } else {
    //         $(this).parent().next().children('button').prop("disabled", false);
    //     }
    // });

    // // 인증번호 입력 여부 -> 재전송,인증하기 버튼 활성/비활성
    // $('[data-auth-number]').on('keyup',function(){
    //     if( $(this).val().length === 0 ){
    //         $(this).next().prop("disabled", true);
    //         $(this).parent().next().children('button').prop("disabled", true);

    //     } else {
    //         $(this).next().prop("disabled", false);
    //         $(this).parent().next().children('button').prop("disabled", false);
    //     }
    // });

    // [아코디언] QnA 목록
    var $QItem = $('.accordion-list .item-q');
    var $AItem = $('.accordion-list .item-a');

    $QItem.each( function() {
        $(this).on('click', function(){
            if($(this).attr("aria-expanded") === 'true') {
                $(this).attr("aria-expanded","false").find('span').text('열기');
                $AItem.attr("aria-hidden","true");
                $(this).next().attr("aria-hidden","true");
            } else {
                $QItem.attr("aria-expanded","false");
                $(this).attr("aria-expanded","true").find('span').text('닫기');
                $AItem.attr("aria-hidden","true");
                $(this).next().attr("aria-hidden","false").show();
            }
        });
    });

    // 수평 목록(터치 시 중앙으로 이동)
    var $scrollitem = $('.h-scroll-item');
    var scrollWidth = 0;

    for (var i=0; i<$scrollitem.length; i++) {
        scrollWidth += $scrollitem.eq(i).outerWidth();
    }

    $('.h-scroll-wrapper').css('width',scrollWidth);
    $scrollitem.click(function(){
        var target = $(this); 
        $scrollitem.removeClass('on')
        target.addClass('on');
        muCenter(target);
    })

    function muCenter(target){
        var scrollBox = $('.h-scroll');
        var scrollBoxItem = scrollBox.find('.h-scroll-item');
        var scrollBoxHarf = scrollBox.width()/2;
        var pos;
        var listWidth = 0;
        var targetLeft = 0;

        scrollBoxItem.each(function(){ listWidth += $(this).outerWidth(); });
        
        for (var i=0; i<target.index(); i++) targetLeft += scrollBoxItem.eq(i).outerWidth(); // 선택요소까지 길이
        
        var selectTargetPos = (targetLeft + target.outerWidth()/2);
        if (selectTargetPos <= scrollBoxHarf) { // Left
            pos = 0;
        }else if (listWidth - selectTargetPos <= scrollBoxHarf) { // Right
            pos = listWidth-scrollBox.width();
        }else {
            pos = selectTargetPos - scrollBoxHarf; // Center
        }
        
        setTimeout(function(){
            scrollBox.animate({scrollLeft:pos}, 300);
        }, 200);
    }

    /* UI-2 [e] */
});

function addNumCommas(x) {
    return x.toString().replace(/[^0-9]/g,"").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
