
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
        $('body').addClass('lock');

        if($(this).attr('data-callback')){
            var callbackName = $(this).attr('data-callback');
            window[callbackName]($(this).attr('data-callback-param') || false);
        }
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
        $('body').removeClass('lock');

        if($(this).attr('data-callback')){
            var callbackName = $(this).attr('data-callback');
            window[callbackName]($(this).attr('data-callback-param') || false);
        }
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

    // app-header-layer
    $('.btn-header-layer').on('click', function(e){
        var $header = $(this).closest('.app-header-wrap');
        $header.toggleClass("header-layer-open");
    })

    // Data Js Excute
    $('[data-js]').each(function(i, el){
        switch ($(this).attr('data-js')){
            case "checkEmpty" :
                checkEmpty(this);
                break;
            case "datepicker" :
                datepicker(this);
                break;
            case "timepicker" :
                timepicker(this);
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

    function datepicker(el){
        if(!$.fn.dateRangePicker) {
            console.error('dateRangePicker has not found');
            return;
        }
        var $container = $(el);
        var $datepicker = $container.find('[data-datepicker]');
        var isSingleDate = $datepicker.attr('data-single-date');
        isSingleDate = isSingleDate == 'false' || isSingleDate == undefined ? false : true;

        $.dateRangePickerLanguages.ko = {...$.dateRangePickerLanguages.ko, 
            "month-name": ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
            "week-1": "Mon",
            "week-2": "Tue",
            "week-3": "Wed",
            "week-4": "Thu",
            "week-5": "Fri",
            "week-6": "Sat",
            "week-7": "Sun",
        }
        var configObject = {
            singleDate : isSingleDate,
            language: 'ko',
            format: 'YYYY.MM.DD',
            separator: ' ~ ',
            showShortcuts: false,
            singleMonth: true
        }
        $datepicker.dateRangePicker(configObject)
        .on('datepicker-opened datepicker-closed', function(e){
            switch(e.type){
                case 'datepicker-opened':
                    $datepicker.addClass('datepicker-opened');
                    break;
                case 'datepicker-closed':
                    $datepicker.removeClass('datepicker-opened');
                    break;
            };
        });
        // today
        if(isSingleDate){
            $container.find('[data-datepicker-today]').on('click', function(e){
                var today = new Date();
                var dateStr = today.getFullYear();
                dateStr += '.' + ((today.getMonth()+1).toString().length < 2 ? '0' : '') + (today.getMonth()+1);
                dateStr += '.' +  (today.getDate().toString().length < 2 ? '0' : '') +  today.getDate();
                $datepicker.val(dateStr);
            });
        }
    }

    function timepicker(el){
        console.log('timepicker');
        var $container = $(el);
        var $btnTimepicker = $container.find('[data-timepicker-show]');
        var $selectedTime = $container.find('[data-timepicker-value]');
        var $wrapper = $container.find('.timepicker-wrapper');
        var days = parseFloat($container.attr('data-timepicker-days')) || 1;
        var itemStr = '';

        /** Flow
         * > check hidden value (seperate ~ )
         * > if has value ? set picker-days
         *   └ draw time items
         *     └ set time items 
         *     └ set button value (if next day ? add "다음날")
         * > if null ? set from attr picker-days
         *   └ draw time items
         *
         * 다음날 처리를 어떤식으로 할지 고민해야함
         * */

        for(var i=0; i<days; i++){
            itemStr += '<ul class="item-wrapper">';
            for(var j=0; j<24; j++){
                itemStr += '<li><button type="button">'+ (j < 10 ? '0'+ j : j) +'시</button></li>' 
            }
            itemStr += '</ul>';
        }
        $wrapper.html(itemStr).on('click', 'button', function(e){
            var time = $(this).parent().index();
            var day = $(this).closest('.item-wrapper').index();

            // temp
            console.log(e.type, day+'_'+time);
            $selectedTime.val(day+'_'+time).trigger('change');
        });

        $selectedTime.on('change', function(e){
            console.log(e.type, this.value);
            $btnTimepicker.val($(this).val());
        });
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
    window.triggerClick = function(id){
        if(!id) return;
        $tg = $('#'+id);
        $tg.trigger('click');
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
        $AItem.hide();
        $('.accordion-list li').eq(0).find('.item-a').show();

        $(this).on('click', function(){
            if($(this).attr("aria-expanded") === 'true') {
                $AItem.slideUp(400).attr("aria-hidden","true");
                $(this).attr("aria-expanded","false").find('span').text('열기');
            } else {
                $QItem.attr("aria-expanded","false");
                $(this).attr("aria-expanded","true").find('span').text('닫기');
                $AItem.hide().attr("aria-hidden","true");
                $(this).next().slideDown(400).attr("aria-hidden","false");
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
