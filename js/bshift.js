        
        sliderResize = function() {

                            var _this = jQuery('.b-active');
                            var new_outer_height = _this.height();
                            //console.log('Height: '+new_outer_height);
                            var new_inner_height = _this.find('.b-shift-content').height();
                            var new_adjust = (new_outer_height/2) - (new_inner_height/2);
                            var span_left_height = _this.find('.slide-nav-left').outerHeight();
                            var span_top_margin = (new_outer_height-span_left_height)/2;
                            if(new_adjust<0) { new_adjust = 0;}
                            _this.find('.b-shift-content').css('padding-top',new_adjust+'px');
                            jQuery('.slide-nav-left').css('top', span_top_margin+'px');
                            jQuery('.slide-nav-right').css('top', span_top_margin+'px');
                            }

        jQuery.fn.extend({

                    bswap: function(eff,dur,current,next){

                        //console.log(current);
                        switch(eff) {
                                case 'slide_vertical': 
                                    //console.log('in slide vertical');                                
                                    jQuery(next).slideToggle(dur,function(){jQuery(this).addClass('b-active');});
                                    jQuery(current).slideToggle(dur,function(){jQuery(this).removeClass('b-active');});
                                    break;
                                
                                case 'fader':
                                    //console.log('in fade');
                                    jQuery(next).fadeIn(dur,function(){jQuery(this).addClass('b-active');});
                                    jQuery(current).fadeOut(dur,function(){jQuery(this).removeClass('b-active');});
                                    break;
                                case 'rotate':
                                    jQuery(next).css({'transform': 'rotate(180deg)'});
                                    jQuery(next).toggle(dur,function(){jQuery(this).addClass('b-active');});
                                    jQuery(current).hide(function(){jQuery(this).removeClass('b-active');});
                                    break;
                                default:
                                    console.log('default toggle');
                                    jQuery(next).show(dur,function(){jQuery(this).addClass('b-active');});
                                    jQuery(current).toggle(dur,function(){jQuery(this).removeClass('b-active');});

                            }               

                    }
        });

        jQuery.fn.extend({

        

                    getInfoalt: function(){
                        
                        var s = new Array();
                        //console.log(this);
                        this.each( function(index) {
                            
                            s.push({
                                "object" : jQuery(this),
                                "class" : jQuery(this).attr('class'),
                                "id" : jQuery(this).attr('id'),
                                "duration" : jQuery(this).attr('data-speed'), 
                                "index" : index,
                                "effect" : jQuery(this).attr('data-effect')
                            });
                                                  
                        });
                        
                        return s;

                    }
                });

        jQuery.fn.extend(
                {
                    bheight: function(){

                        var element = jQuery(this).find('.b-shift-content');                    
                        jQuery(this).css({'position':'relative','visibility':'hidden', 'display':'block'});
                        var inner_height = jQuery(this).find('.b-shift-content').height();
                        var span_height = jQuery(this).find('.b-shift-content li span').outerHeight();
                        var outer_height = jQuery(this).height();
                        var adjust = (outer_height/2) - (inner_height/2);
                        var span_adjust = (outer_height/2) - (span_height/2);
                        jQuery(this).find('.b-shift-content').css('padding-top',+adjust+'px');
                        jQuery(this).find('.b-shift-content li span').css('padding-top',+adjust+'px');
                        //console.log("+"+ span_adjust);
                        jQuery(this).css({'position':'relative','visibility':'visible', 'display':'none'});
                        
                    }
                }
            );

        jQuery.fn.extend(
                {
                    banimate: function(index){
                        
                        //console.log(this);
                        var _this = this;
                        currentSlide = jQuery(_this[index].object);
                        index=index+1;                       
                        if(index==slidesLength){
                            index=0;
                            nextSlide=(_this[0].object);

                        } else {
                            nextSlide=jQuery(currentSlide).next();
                        }
                        
                        jQuery(nextSlide).bheight();
                        var effect = _this[index].effect;
                        var direction = _this[index].direction;
                        var duration = _this[index].duration;
                        var rotation =  _this[index].rotation;
                        var degree = 45;
                        
                        jQuery(_this).bswap(effect,duration,currentSlide,nextSlide);
                                      
                                            
                        bshiftcontroller = setTimeout(function(){ _this.banimate(index)},_this[index].duration);  
                       
                    }
                }
                );

        jQuery.fn.extend(
                {
                    bclick: function(dir) {
                        //console.log(bshiftcontroller);
                        if(typeof bshiftcontroller !== 'undefined') {
                            window.clearTimeout(bshiftcontroller);
                            
                        }
                        var slid = jQuery('.b-frame').find('li');
                        console.log(this[0]);
                        var context = this[0];//this.context;
                        console.log(context);
                        var context_parent = context.parentElement;
                        var cp_parent = context_parent.parentElement;
                        console.log(cp_parent);
                        var eff = jQuery(cp_parent).attr('data-effect');
                        var dur = jQuery(cp_parent).attr('data-speed');
                        var current_slides_index = jQuery(cp_parent).index();

                        //if index = 0....set appropriate previous and if index = slidesLength -1 set next slide = to slide 0
                        if (current_slides_index==0) {
                            var cp_parent_prev = slid[slidesLength-1];
                            var cp_parent_next = jQuery(cp_parent).next();
                        } else if (current_slides_index==slidesLength-1) {
                            var cp_parent_prev = jQuery(cp_parent).prev();
                            var cp_parent_next = slid[0];
                        } else {
                            var cp_parent_prev = jQuery(cp_parent).prev();
                            var cp_parent_next = jQuery(cp_parent).next();
                        }
                        console.log(cp_parent);
                        //jQuery(cp_parent).fadeOut();
                        if(dir =="left") { 
                            jQuery(cp_parent_prev).bheight();
                            jQuery(this).bswap(eff,dur,cp_parent,cp_parent_prev);
                            //jQuery(cp_parent_prev).fadeIn('fast');
                            --current_slides_index;
                        }
                        else {
                            jQuery(cp_parent_next).bheight();
                            jQuery(this).bswap(eff,dur,cp_parent,cp_parent_next);
                            //jQuery(cp_parent_next).fadeIn('fast');
                            ++current_slides_index;
                            //console.log(current_slides_index);
                        }
                        if(current_slides_index==-1) {
                            current_slides_index = slidesLength-1;
                        }
                        if(current_slides_index==slidesLength) {
                            current_slides_index = 0;
                        }

                        var autoplay = jQuery('.b-frame').attr('data-autoplay');
                        console.log(jQuery('.b-frame').attr('data-autoplay'));
                        if(autoplay=='true') {
                            bshiftcontroller = setTimeout(function(){
                                slid.bshift(current_slides_index)
                            },
                            jQuery(slid[current_slides_index]).attr('data-speed'));
                        }
                    }                    
                        
                });
        jQuery.fn.extend(
                {
                    bshift: function(index){                        
                        //console.log(index);
                        window.addEventListener("resize", sliderResize);   
                        info = this.getInfoalt();
                        //console.log(info);  
                        jQuery(info).banimate(index);                       
                    }
                }
            );  

        jQuery(document).ready(function($) {

            var slider_height = $('.b-frame').height();
            var content_height = $('.b-shift-content').height();
            var slider_top_margin = (slider_height-content_height)/2;
            $('.b-shift-content').css('padding-top', slider_top_margin+'px');
            var span_left_height = $('.slide-nav-left').outerHeight();
            var span_top_margin = (slider_height-span_left_height)/2;
            $('.slide-nav-left').css('top', span_top_margin+'px');
            $('.slide-nav-right').css('top', span_top_margin+'px');
            var autoplay = $('.b-frame').attr('data-autoplay');
            i = 0;
            index = 0;
            slides = $('.b-frame').find('li');
            slidesLength = slides.length;
            var a = 0;
            $('.b-shift-content span').click(function(){ dir = $(this).attr('data-direction'); $(this).bclick(dir)});

            if(autoplay=='true') {
                bshiftcontroller = setTimeout(function(){slides.bshift(0)},$(slides[0]).attr('data-speed')); 
            }
        });