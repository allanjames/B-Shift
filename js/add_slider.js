(function($, window){

window.imageHeightChange = function(e) {

    img_height = $(this).val();
    console.log(img_height);
    var index = $(this).attr('data-index');
    $('.inner-image-'+index).css('height',img_height);

}

window.imageBottomAdj = function(e) {

        bottom = $(this).val();
        var index = $(this).attr('data-id');
        $('#option-b-'+index).css('bottom', bottom+'%' );

}

window.textPositionChange = function(e) {

        console.log(e);
        var index = $(this).attr('data-id');
        text_position = $(this).val();
        if(text_position=="center") {
            $('#option-a-'+index).css({'float': text_position, 'transform': "none" });
        } else {
            $('#option-a-'+index).css({'float': text_position, 'transform': "translateY(-50%)" });
        }
            
}

window.imagePositionChange = function(e) {

        console.log(e);
        var index = $(this).attr('data-id');
        image_position = $(this).val();
        console.log(image_position);
        if(image_position=="none") {
            $('#option-b-'+index).css({'float': image_position, 'transform': "none" });
        } else {
            $('#option-b-'+index).css({'float': image_position, 'transform': "translateY(-50%)" });
        }

}

window.changeContentColor = function(e) {

        var color_input = $(this).val();
        var index = $(this).attr('data-id');
        console.dir(color_input);
        var type = $(this).attr('data-color-type');
        switch(type) {
            case "foreground" :
                $('#slide-preview-inner-'+index).css('color','#'+color_input);
                break;
            case "background" :
                $('#slide-preview-inner-'+index).css('background-color','#'+color_input);
                break;
        }
        //console.log($('#slide-preview-inner-'+index).css('color'));
}

window.initializeFormGrouping = function() {
        $('.jscolor').on('blur', changeContentColor);
        $('.btm').on('keyup', imageBottomAdj);
        $('.ih').on('keyup', imageHeightChange);
        $('.ip').on('change', imagePositionChange);
        $('.tp').on('change',{ obj: $(this)}, textPositionChange);
}


}(jQuery, window));

jQuery(document).ready(function($){

    initializeFormGrouping();
    var button_color = $('.b-shift-content').attr('color');
    $('.slick-arrow').attr('color', button_color);

    $('.slick-arrow').mouseover(function() {
        var button_color = $('.slick-active .b-shift-content').attr('color');
        $('.slick-arrow').attr('color', button_color);
    });

    

    function tinyMce_init(_mode) {

            tinyMCE.init({ 
                            mode: _mode,
                            selector : ".bshift-editor",
                            browser_spellcheck : true,
                            valid_elements : 'h1,h2,h3,h4,h5,ul,div,br,a[href],em,strong',
                            menubar : false,
                            plugins: ['code  anchor fullscreen'],
                            resize: 'both',
                            toolbar: ["code | link image | bold italic | alignleft | aligncenter | alignright | bullist | undo redo | anchor | fullscreen"],
                            selection_toolbar: 'h2',
                            setup: function(editor) {
                                editor.on('keyup', function(editor){
                                    var mce = $('#tinymce');
                                    var active = document.activeElement;
                                    var parent = active.parentNode
                                    var g_parent = parent.parentNode;
                                    var gg_parent = g_parent.parentNode;
                                    var gg_parent_prev = $(gg_parent).prev();
                                    var indx = $(gg_parent_prev).attr('data-index');
                                    var latest = tinyMCE.activeEditor.getContent({format : 'html'});
                                    dynamicText(latest,indx);
                                    });
                                editor.on('change', function(editor){
                                    console.log('changed');
                                    var mce = $('#tinymce');
                                    var active = document.activeElement;
                                    var parent = active.parentNode
                                    var g_parent = parent.parentNode;
                                    var gg_parent = g_parent.parentNode;
                                    var gg_parent_prev = $(gg_parent).prev();
                                    var indx = $(gg_parent_prev).attr('data-index')
                                    var latest = tinyMCE.activeEditor.getContent({format : 'html'});
                                    dynamicText(latest,indx);

                                    });
                            }
                             
                            
                        }); 

    }

    $('.ih').keyup(function() {
        console.log($(this).val());
        img_height = $(this).val();
        var i = $(this).attr('data-index');
        $('.inner-image-'+i).css('height',img_height);
    });

    $('.slide_title').on('mousedown',function(e) {
        $(this).data('p0', { x: e.pageX, y: e.pageY }).on('mouseup', function(f) {
            var parents = $(this).parents();
            var node = parents[0];
            console.log($(this).data('p0'));
            console.log(f.pageX+':'+f.pageY);

        });
    });
   

   $('.show_slide .ip').on('change',function() {
        image_position = $(this).val();
        console.log(image_position);
        if(image_position=="none") {
            $('.show_slide .option-b').css({'float': image_position, 'transform': "none" });
        } else {
            $('.show_slide .option-b').css({'float': image_position, 'transform': "translateY(-50%)" });
        }
   });


   $('#slide_width').keyup(function() {

        var prev_width = $(this).val();
        var metric = $(this).next().val();
        console.log(metric);
        var new_width = prev_width + metric;
        $('.slide-preview div').css('width', new_width);
   });

    function dynamicText(a,b) {
    	
        $('#slide-preview-'+b+' div div div.option-a').html(a);
        var dynamic_height = $('input[name="height"]').val();
        $('.inner_prev').css('height',dynamic_height);
    }

    tinyMce_init('textareas');
    
            

    var qid = $('#new_slide').attr('data-pid');
    var data = {
        'action': 'bshift_action_two',
        'id': qid
        };

    $.post(ajaxurl, data, function(response) {
            console.log(response);
            var reta = JSON.parse(response);
            slides_length = reta.lid;
    });

    $(document).on('click','.slide_title',function( event ) {

        var current_index = $(this).parent().attr('data-id');
        $('input[name="visible"]').val(current_index);
        var parent = $(this).parent();
        var grand_parent = $(parent).parent();
        //console.log(grand_parent);
        var engaged = $(grand_parent).find('.engaged');
        $(engaged).removeClass('engaged');
        var active_slide = $(parent).find('.ib');
        //console.log(active_slide);
        var obj = $('.ib.show_slide');
        $(obj).removeClass('show_slide').addClass('collapse');
        $(active_slide).removeClass('collapse').addClass('show_slide');
        $(this).addClass('engaged');

    });

    $(document).on('click','.delete_slide',function( event ) {
        event.preventDefault();
        $('input[name="visible"]').val(0);
        var garbage = $(this).parent();
        $(garbage).remove();
        //add AJAX call to database to update slide array
        $('#slides').trigger('submit');
        $('.btn_save').show();
        console.log($(this).attr('data-ref'));
        /*if($(this).attr('data-ref')==0) {
            location.reload();
        }*/
        
    });

    $(document).on('change','input #image_url', function() {
        var pic_url = $(this).val();
        $('.slide-preview div').css("background-color","red");
        console.log($('.slide-preview div').css("background-color"));
    });

    $(document).on('click','.b-current .switch-html', function() {
        $('.mce-tinymce').hide();
        $('.b-current .bshift-editor').show();
    });

    $(document).on('click','.add_new_slide',function(event) {
        //$(this).hide();
        console.log(this);
        var _this = this;
        //$('#slides ul li').hide();
        var form = $(this).parents();
        var new_index = $(form[2]).attr('data-slide-count');
        $('input[name="visible"]').val(new_index);
        $('.btn_save').parent().show();
        //$('.ib collapse').removeClass('collapse');
        //$('.show_slide').addClass('collapse');

        var pid = $(this).attr('data-pid');
        var parent = $(this).context;
        //console.log($(parent).attr('id'));
        //console.log(pid);
        var data = {
        	'action': 'bshift_action_three',
        	'id': pid
        };
        

        //ajaxurl is always defined in the admin header and points to admin-ajax.php
        $.post(ajaxurl, data, function(response) {
            
            $(_this.parentElement).before(response);
            initializeFormGrouping();
            //$('.ib show_slide').css('display','none !important');
            //$('.ib show_slide').css('visibility','collapse');
            var par = $(_this).parent().prev();
            var div = $(par).children();
            var show = div[1];
            var show_slide = $('#slides').find('.show_slide');
            $(show_slide).removeClass('show_slide');
            $(show_slide).addClass('collapse');
            var active = $('#slides').find('.ib');
            var heading = $('#slides').find('.slide_title');
            var heading_length = heading.length;
            var new_head = $(heading[heading_length-1]);

            console.log(heading_length);
            var engage = $('#slides').find('.engaged');
            console.log(engage);
            $(engage).removeClass('engaged');
            $(new_head).addClass('engaged');
            $('.add_new_slide').hide();
            var len = active.length;
            //console.log(active_li);
            $(show).removeClass('collapse');
            $(show).addClass('show_slide');
            console.log(show);
            //console.log(div[1]);
            
            console.log($(_this).parent().prev());

            jscolor.installByClassName("jscolor");
            tinyMce_init('none');
            
        });
        
       
    });
    
    $(document).on( 'click', '.delete-post', function(e) {
        event.preventDefault();
        console.log(e);
        var id = $(this).data('id');
        console.log($(this).parents('#post-'+id));
        var slide = $(this).parents('#post-'+id);
        console.log(slide);

        $.ajax({
            type: 'post',
            url: ajaxurl,
            data: {
                action: 'bshift_delete_post',
                id: id
            },
            success: function( result ) {
                //console.log(slide);
                var response = $.trim(result);
                if( response == 'success' ) {
                    console.log(slide);
                    slide.fadeOut( function(){
                        slide.remove();
                    });
                }
            }
        });
        return false;
    });

    
    
});



function shiftImage(val) {
        console.log(val);
        image_pos = document.getElementById("image-frame");
        image_pos.style.float=val;
        
}

function shiftText(val) {
        console.log(val);
        text_pos = document.getElementById("text-frame");
        console.log(text_pos);
        console.log("selected"+val);
        text_pos.style.float=val;
        text_pos.style.transform="translateY(-50%)";
}

function imageHeight(height) {
        console.log(height);
        img_in = document.getElementById("inner-image");
        img_in.style.height=height+'px';
}