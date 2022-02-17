var SpatialContextButtonResponse = (function (jspsych) {
    "use strict";
  
    const info = {
      name: "SPATIAL-CONTEXT-BUTTON-PLUGIN",
        // stimuli image, choices to label buttons
      parameters: {
         /** The image to be displayed */
        stimulus: {
            type: jspsych.ParameterType.IMAGE,
            pretty_name: "Stimulus",
            default: undefined,
        },
        stimulus_width: {
            type: jspsych.ParameterType.INT,
            pretty_name: "Image width",
            default: null,
        },
        choices: {
            type: jspsych.ParameterType.STRING,
            pretty_name: "Choices",
            default: undefined,
            array: true,
        },
        prompt: {
            type:jspsych.ParameterType.HTML_STRING,
            pretty_name: "Prompt",
            default: null,
        },
        
      },
    };
  
    /**
     * **Spatial Context Button Response Plugin-NAME**
     *
     * SHORT PLUGIN DESCRIPTION
     *
     * @author Athena Leong
     * @see {@link https://DOCUMENTATION_URL DOCUMENTATION LINK TEXT}
     */
    class SpatialContextPlugin {
      constructor(jsPsych) {
        this.jsPsych = jsPsych;
      }
      //display element: HTMLElement, trial:TrialType
      trial(display_element, trial) {
        // first clear the display element (because the render_on_canvas method appends to display_element instead of overwriting it with .innerHTML)
        if (display_element.hasChildNodes()) {
          // can't loop through child list because the list will be modified by .removeChild()
          while (display_element.firstChild) {
            display_element.removeChild(display_element.firstChild);
          }
        }


        var html = '';
      
        html += '<div id="spatial-context-main-div">';

      
        html += '<div id="spatial-context-btn-div" display="flex" position:"absolute" >';

        for (var i = 0; i < trial.choices.length; i++) {
          html += '<button class="spatial-context-btn">' + trial.choices[i] + '</button>';
        }
        
        html += '</div>';

        html += '<img src="' + trial.stimulus + '" id="spatial-context-stimulus"/>'

         // update the page content
        display_element.innerHTML = html;


        var img = display_element.querySelector(
          "#spatial-context-stimulus"
        )

        //Set stimulus style
        var width = trial.stimulus_width;
        var height = trial.stimulus_height;
        img.style.height = height.toString() + "px";
        img.style.width = width.toString() + "px";



        //Set main div style
        var div = display_element.querySelector(
          "#spatial-context-main-div"
        )
        div.style.height = height.toString() + "px";
        div.style.width = width.toString() + "px";
        // div.style.background = url(trial.stimulus);
        div.style.position = 'relative';


         //Set button div style
        var btn_div = display_element.querySelector(
          "#spatial-context-btn-div"
        )
        btn_div.style.height = height.toString() + "px";
        btn_div.style.width = width.toString() + "px";
        btn_div.style.position = 'absolute';
        btn_div.style.display = 'flex';
        btn_div.style.zIndex='10';
        btn_div.style.flexWrap = 'wrap';

        //Set button style
        var buttons = display_element.querySelectorAll(
          ".spatial-context-btn"
        );

        buttons.forEach(function(btn) {
          btn.style.width = (width/2).toString() + "px";
          btn.style.backgroundColor = "transparent";
          btn.style.border = 'none';
          btn.style.fontSize = 0;
          btn.style.height = (height/2).toString() + "px";
          btn.style.borderRadius = (30).toString() + "px";
        });

        // start timing
        var start_time = performance.now();

        // Add Listener 
        buttons.forEach(function(btn) {
          btn.addEventListener("click", (e) => {
            var choice = e.target.innerHTML;
            after_response(choice)
          })
        })

        // store response
        var response = {
          rt: null,
          button: null,
        };

         // function to handle responses by the subject
        function after_response(choice) {
          // measure rt
          var end_time = performance.now();
          var rt = Math.round(end_time - start_time);
          response.button = choice;
          response.rt = rt;

          // disable all the buttons after a response
          buttons.forEach(function(btn) {
            btn.setAttribute("disabled", "disabled");
          })

          
          end_trial();
        }

          


        // function to end trial when it is time
        const end_trial = () => {
          // kill any remaining setTimeout handlers
          this.jsPsych.pluginAPI.clearAllTimeouts();

          // gather the data to store for the trial
          var trial_data = {
            rt: response.rt,
            stimulus: trial.stimulus,
            response: response.button,
          };

          // clear the display
          display_element.innerHTML = "";

          // move on to the next trial
          this.jsPsych.finishTrial(trial_data);
        };
      }
    }
    SpatialContextPlugin.info = info;
  
    return SpatialContextPlugin;
  })(jsPsychModule);
