
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

});

function addNumCommas(x) {
    return x.toString().replace(/[^0-9]/g,"").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
