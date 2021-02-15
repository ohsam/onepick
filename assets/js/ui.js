
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
        $tgLayer.data('focus-back-target', $(this))
            .show().find('> *:first-child').attr('tabindex', '0').focus();
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
        $tgLayer.hide().attr('tabindex', '').data('focus-back-target').focus();
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
            case "releaseDisabled" :
                releaseDisabled(this);
                break;
            case "checkevent_01" :
                checkevent_01(this);
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
        var $opener = $container.find('[data-datepicker-opener]');
        var isSingleDate = $datepicker.attr('data-single-date');
        isSingleDate = isSingleDate == 'false' || isSingleDate == undefined ? false : true;
        var isInline = $datepicker.attr('data-inline');
        isInline = isInline == 'false' || isInline == undefined ? false : true;
        var isApply = $datepicker.attr('data-apply');
        isApply = isApply == 'false' || isApply == undefined ? false : true;
        var maxDays = $datepicker.attr('data-max-days') || 0;
        var container = $datepicker.attr('data-container') || 'body';
        var $btnApply = null;

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
            language: 'ko',
            format: 'YYYY.MM.DD',
            separator: ' ~ ',
            showShortcuts: false,
            singleMonth: true,
            container: container,
            singleDate : isSingleDate,
            inline: isInline,
            maxDays: maxDays
        }
        if(isApply){
            configObject.getValue = function(){
                return $datepicker.val();
	        }
            configObject.setValue = function(s){
                $datepicker.val(s);
                $btnApply.val(s+' 조회하기');
	        }
        }
        
        $datepicker.dateRangePicker(configObject)
        .on('datepicker-opened datepicker-closed', function(e){
            switch(e.type){
                case 'datepicker-opened':
                    $datepicker.addClass('datepicker-opened');
                    $opener.addClass('datepicker-opened');
                    break;
                case 'datepicker-closed':
                    $datepicker.removeClass('datepicker-opened');
                    $opener.removeClass('datepicker-opened');
                    break;
            };
        }).on('initComplete', function(e){
            if(isApply){
                var datepickerEl = $datepicker.data('dateRangePicker').getDatePicker();
                $btnApply = $('<input type="button" value="조회하기">');
                datepickerEl.find('.month-wrapper').append($('<div class="apply-box">').append($btnApply));
                $btnApply.on('click', function(e){
                    if($datepicker.val()){
                        console.log('btnApply click');
                        $datepicker.data('dateRangePicker').close();
                    }
                });
            }
        });

        $opener.on('click', function(e){
            e.stopPropagation();
            $datepicker.trigger('click');
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
        var $content = $container.find('.timepicker--content');
        var $wrapper = $container.find('.timepicker-wrapper');
        var $btnClose = $container.find('[data-timepicker-close]');
        var days = parseFloat($container.attr('data-timepicker-days')) || 1;
        var splitter = ' ~ ';
        var isComplete = {"start":false};
        var dataObj = {
            "start": [],
            "end": []
        }
        /*
        var sample = {
            "start": ["d1", "08:00"],
            "end": ["d2", "09:00"],
        }*/
        
        var itemStr = '';
        for(var i=0; i<days; i++){
            itemStr += '<ul class="item-wrapper" data-timepicker-day="d'+ (i+1) +'">';
            for(var j=0; j<24; j++){
                itemStr += '<li><button type="button">'+ (j < 10 ? '0'+ j : j) +'시</button></li>' 
            }
            itemStr += '</ul>';
        }

        // button click
        $wrapper.html(itemStr).on('click', 'button', function(e){
            var items = $wrapper.find('li');
            var day = $(this).closest('.item-wrapper').index();
            var time = $(this).parent().index();

            if(!isComplete.start){
                items.removeClass('start section end');
                $(this).parent().addClass('start');
                dataObj.start[0] = day;
                dataObj.start[1] = time;
                isComplete.start = true;
            }else{
                dataObj.end[0] = day;
                dataObj.end[1] = time;
                // end 날짜가 이전이거나, 같은날의 시간이 이전일 경우
                if(day < dataObj.start[0] || (day == dataObj.start[0] && time < dataObj.start[1])){
                    dataObj = {...dataObj, "temp":[...dataObj.start]};
                    dataObj.start = [...dataObj.end];
                    dataObj.end = [...dataObj.temp];
                }
                var data = {
                    "start": ['d'+(dataObj.start[0]+1), (dataObj.start[1] < 10 ? '0' : '') + dataObj.start[1] + ':00'],
                    "end": ['d'+(dataObj.end[0]+1), (dataObj.end[1] < 10 ? '0' : '') + dataObj.end[1] + ':00']
                }
                setTimeValue(data);
            }
        });

        $selectedTime.on('change', function(e){
            setTimeValue(getTimeValue());
        });

        $btnTimepicker.on('click', function(e){
            if($content.length > 0){
                $content.slideToggle();
            }else{
                $wrapper.slideToggle();
            }
            $(this).toggleClass('timepicker-opened');
        });

        $btnClose.on('click', function(e){
            if(isComplete.start){
                $wrapper.find('li').removeClass('start section end');
                setTimeValue(getTimeValue());
            }
            $btnTimepicker.removeClass('timepicker-opened').focus();
            $content.slideUp();
        });

        // getter
        function getTimeValue(){
            var timeVal = $selectedTime.val();
            if(!timeVal) return false;
            timeVal = timeVal.split(splitter);
            return {
                "start": timeVal[0].split(' '),
                "end": timeVal[1].split(' ')
            }
        }
        // setter
        function setTimeValue(dataObj){
            if(!dataObj) return;

            // hidden value
            var valueStr = dataObj.start[0] + ' ' + dataObj.start[1] + splitter + dataObj.end[0] + ' ' + dataObj.end[1];
            $selectedTime.val(valueStr);

            // text display
            var timeStr = (dataObj.start[0] != 'd1' ? '다음날' : '') + dataObj.start[1] + splitter + (dataObj.end[0] != 'd1' ? '다음날' : '') + dataObj.end[1];
            $btnTimepicker.val(timeStr);

            // button display
            var startIndex = 24 * (parseFloat(dataObj.start[0].split('d')[1]) - 1) + (parseFloat(dataObj.start[1].split(':')[0]));
            var endIndex = 24 * (parseFloat(dataObj.end[0].split('d')[1]) - 1) + (parseFloat(dataObj.end[1].split(':')[0]));
            var items = $wrapper.find('li');
            items.each(function(i, el){
                if(i == startIndex){
                    $(this).addClass('start');
                }else if(i > startIndex && i < endIndex){
                    $(this).addClass('section');
                }else if(i == endIndex){
                    $(this).addClass('end');
                }
            });

            // flags
            isComplete.start = false;
            console.log('selectedTime.value::',$selectedTime.val());
        }

        setTimeValue(getTimeValue());
    }

    function releaseDisabled(el){
        $button = $(el).find('button').eq(0);
        if($button.length < 1) return;
        $button.on('click', function(e){
            var $target = $(this).siblings('input').eq(0);
            var val = $target.val();
            $target.get(0).disabled = false;
            $target.val('').val(val).focus();
        })
    }

    function checkevent_01(el){
        var $checkbox = $(el);
        var $eventTarget = $($checkbox.attr('data-checkevent-target')).eq(0);
        $checkbox.on('change', function(e){
            if(e.target.checked){
                $eventTarget.addClass('disabled');
            }else{
                $eventTarget.removeClass('disabled');
            }
        }).trigger('change');
    }


    // window Fn
    window.openLayer = function(layerName){
        var $tgLayer = $('[data-layer-name="'+layerName+'"]');
        if(!$tgLayer.hasClass('full')){
            $('[data-layer-name]').filter(':not(.full)').hide();
        }
        $tgLayer.data('focus-back-target', $('*:focus').eq(0))
            .show().find('> *:first-child').attr('tabindex', '0').focus();
        $('body').addClass('lock');
    }
    window.closeLayer = function(layerName){
        $tgLayer = $('[data-layer-name="'+layerName+'"]');
        $tgLayer.hide().attr('tabindex', '').data('focus-back-target').focus();
        $('body').removeClass('lock');
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

    $(window).on('load', function(){
        var $stickyTarget = $('[data-sticky-header]');
        if ($stickyTarget.length > 0) {
            var $stickyPos = $stickyTarget.attr('data-sticky-top');
            $stickyTarget.sticky({ topSpacing: parseInt($stickyPos) });
        } else {
            return false;
        }        
    });

    /* UI-2 [e] */
});

function addNumCommas(x) {
    return x.toString().replace(/[^0-9]/g,"").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
