function multi_part_hsform(hub_id, form_id) {
  hbspt.forms.create({
    portalId: hub_id,
    formId: form_id,
    onFormReady: function ($form) {
      $(formid).addClass('form-loaded');
      $(formid + ' .hs-richtext')
        .parent()
        .addClass('wrapper-point');

      $(document).on('keypress', formid + ' form', function (event) {
        return event.keyCode != 13;
      });

      $(formid + ' .wrapper-point').each(function (index) {
        var dataStep = 'step' + (index + 1);
        var step = index + 1;

        $(this)
          .nextUntil('.wrapper-point')
          .addBack()
          .wrapAll(
            '<div data-filter=".' +
              dataStep +
              '" class="form-step-content ' +
              dataStep +
              '"  />',
          );
        $(formid + ' .ms-form-steps').append(
          '<div class="from-step-outer ' +
            dataStep +
            '"><div class="from-step" data-filter="' +
            dataStep +
            '">{{ module.theme_settings.step_label }} ' +
            step +
            '</div></div>',
        );
      });

      $(formid + ' .form-step-content').each(function () {
        if (!$(this).find('.hs-button.primary').length > 0) {
          $(this).append(
            '<a class="hs-button primary prev-btn "><i class="fa fa-angle-left"></i> {{ module.theme_settings.previous_button_text }} </a>  <a class="hs-button disable primary next-btn">{{ module.theme_settings.next_button_text }} <i class="fa fa-angle-right"></i></a>',
          );
        } else {
          $(this)
            .find('.actions')
            .prepend(
              '<a class="hs-button primary prev-btn"><i class="fa fa-angle-left"></i> {{ module.theme_settings.previous_button_text }} </a> <a class="hs-button  primary next-btn submit_btn">Submit</a>',
            );
        }
      });

      $(
        formid +
          ' .form-step-content.step1,.ms-form-steps .from-step-outer:first-child',
      ).addClass('active');
      var validity = false;
      $(document).on(
        'click',
        formid + '.ms-survey-from .next-btn',
        function () {
          var el = $(this);
          var element = $(this)
            .closest('.form-step-content')
            .find('[required]');
          var elementtwo = $(this)
            .closest('.form-step-content')
            .find('ul[required]');
          var file = $(this)
            .closest('.form-step-content')
            .find('input[type="file"]');
          var elcount = 0;

          var getRel = $(this)
            .closest('.form-step-content')
            .attr('data-filter');
          if (!element.hasClass('invalid')) {
            validity = true;
          } else {
            validity = false;
          }

          element.each(function () {
            var elnew = $(this);
            $(this).focus();
            elnew.blur();
            setTimeout(function () {
              if (elnew.hasClass('invalid')) {
                validity = false;
              }
            }, 500);
          });

          elementtwo.each(function () {
            var elnew = $(this).find('input');

            elnew.each(function () {
              var el = $(this);

              if (el.is(':checked')) {
                elcount = elcount + 1;
              }
            });

            console.log(elcount);
            if (elcount < 1) {
              validity = false;
              $(this).after(
                '<ul class="no-list hs-error-msgs inputs-list" ><li><label >Please complete this required field.</label></li></ul>',
              );
            } else {
              $(this).next('.hs-error-msgs').remove();
            }

            elcount = 0;
          });

          file.each(function () {
            if (
              $(this).closest('.hs_file_upload').find('.hs-form-required')
                .length > 0
            ) {
              var getid = $(this).attr('id');

              if ($(this).get(0).files.length === 0) {
                validity = false;
                $(this)
                  .closest('.hs-form-field')
                  .after(
                    '<ul class="no-list hs-error-msgs inputs-list" ><li><label >Please complete this required field.</label></li></ul>',
                  );
              } else {
                $(this)
                  .closest('.hs-form-field')
                  .next('.hs-error-msgs')
                  .remove();
              }
            }
          });

          $(formid).click();

          setTimeout(function () {
            if (validity) {
              $(formid + ' .from-step-outer' + getRel)
                .removeClass('active')
                .addClass('completed');
              $(formid + ' .from-step-outer' + getRel)
                .next()
                .addClass('active');
              el.closest('.form-step-content')
                .removeClass('active invalid')
                .fadeOut('500', function () {
                  el.closest('.form-step-content')
                    .next()
                    .addClass('active')
                    .fadeIn(500);
                  validity = false;
                });

              if (el.hasClass('submit_btn')) {
                //$(this).next('input[type="submit"]').click();
                $(formid + ' input[type="submit"]').click();
              }
            } else {
              el.closest('.form-step-content').addClass('invalid');
            }
            elcount = 0;
          }, 500);
        },
      );

      $(document).on(
        'click',
        formid +
          '.ms-survey-from input[type="checkbox"] , ' +
          formid +
          '.ms-survey-from input[type="radio"]',
        function () {
          var el = $(this);
          if (el.is(':checked')) {
            el.closest('ul').next('.hs-error-msgs').remove();
          }
        },
      );

      $(document).on(
        'change',
        formid + '.ms-survey-from input[type="file"]',
        function () {
          $(this).closest('.hs-form-field').next('.hs-error-msgs').remove();
        },
      );

      var btnval = $(formid + ' .submit_btn')
        .next('input[type="submit"]')
        .val();
      $(formid + ' .submit_btn').text(btnval);

      $(formid + '.ms-survey-from').on('click', '.prev-btn', function () {
        var el = $(this);
        var getRel = $(this)
          .closest(formid + ' .form-step-content')
          .attr('data-filter');
        $(formid + ' .from-step-outer' + getRel)
          .removeClass('active')
          .removeClass('completed');
        $(formid + ' .from-step-outer' + getRel)
          .prev()
          .addClass('active')
          .removeClass('completed');
        el.closest(formid + ' .form-step-content')
          .removeClass('active')
          .fadeOut('500', function () {
            el.closest(formid + ' .form-step-content')
              .prev()
              .addClass('active')
              .fadeIn();
          });
      });
      $(formid + ' .page-center').show();
      $(formid + ' .form-loader').hide();
    },
  });
}

window.multi_part_hsform = multi_part_hsform;
