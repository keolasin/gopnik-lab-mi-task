var SpatialContextImage= (function (jspsych) {
    "use strict";
  
    const info = {
      name: "SPATIAL-CONTEXT-IMAGE-PLUGIN",
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
        /** If true, then trial will end when user responds. */
        response_ends_trial: {
            type: jspsych.ParameterType.BOOL,
            pretty_name: "Response ends trial",
            default: true,
        },  
         /** How long to show the trial. */
        trial_duration: {
            type: jspsych.ParameterType.INT,
            pretty_name: "Trial duration",
            default: null,
        },
      },
    };
  
    /**
     * **Spatial Context Image Plugin**
     *
     * Display Single Image, Skip to next trial when image pressed
     *
     * @author Athena Leong
     * @see {@link https://DOCUMENTATION_URL DOCUMENTATION LINK TEXT}
     */
    class SpatialContextImagePlugin {
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
        html += '<button id="spatial-context-btn"> </button>';
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
        div.style.overflow = 'hidden';


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
        var btn = display_element.querySelector(
          "#spatial-context-btn"
        );

        btn.style.height = height.toString() + "px";
        btn.style.width = width.toString() + "px";
        btn.style.backgroundColor = "transparent";
        btn.style.border = 'none';

        // start timing
        var start_time = performance.now();

        // store response
        var response = {
            rt: null,
          };
  
        // Add Listener 
        btn.addEventListener("click", (e) => {
            var end_time = performance.now();
            var rt = Math.round(end_time - start_time);
            response.rt = rt;
            btn.setAttribute("disabled", "disabled");
            end_trial();
        })

        // end trial if time limit is set
        if (trial.trial_duration !== null) {
            this.jsPsych.pluginAPI.setTimeout(() => {
                end_trial();
            }, trial.trial_duration);
            } else if (trial.response_ends_trial === false) {
            console.warn(
                "The experiment may be deadlocked. Try setting a trial duration or set response_ends_trial to true."
            );
        }
        
 
        // function to end trial when it is time
        const end_trial = () => {
          // kill any remaining setTimeout handlers
          this.jsPsych.pluginAPI.clearAllTimeouts();

          // gather the data to store for the trial
          var trial_data = {
            rt: response.rt,
            stimulus: trial.stimulus,
          };

          // clear the display
          display_element.innerHTML = "";

          // move on to the next trial
          this.jsPsych.finishTrial(trial_data);
        };
      }
    }
    SpatialContextImagePlugin.info = info;
  
    return SpatialContextImagePlugin;
  })(jsPsychModule);
