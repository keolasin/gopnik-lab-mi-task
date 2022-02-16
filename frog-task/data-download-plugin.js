var DataDownloadPlugin = (function (jspsych) {
    "use strict";
  
    const info = {
      name: "Data-Download",
      parameters: {
        // parameter_name: {
        //   type: jspsych.ParameterType.INT,
        //   default: undefined,
        // },
        // parameter_name2: {
        //   type: jspsych.ParameterType.IMAGE,
        //   default: undefined,
        // },
      },
    };
  
    /**
     * **PLUGIN-NAME**
     *
     * SHORT PLUGIN DESCRIPTION
     *
     * @author YOUR NAME
     * @see {@link https://DOCUMENTATION_URL DOCUMENTATION LINK TEXT}
     */
    class DataDownloadPlugin {
      constructor(jsPsych) {
        this.jsPsych = jsPsych;
      }
      trial(display_element, trial) {

        //Prepare Data
        var id = jsPsych.data.get().filter({type: 'prompt'}).values()[0].response.Q0; // get prompt response
        jsPsych.data.addProperties({ID: id}); // add it to the data

        var data_string = jsPsych.data.get().csv(); // get data as csv string

        //Prepare File Blob
        const blob_to_save = new Blob([data_string], {
            type: "text/plain",
          });
        let blob_URL = "";
        if (typeof window.webkitURL !== "undefined") {
        blob_URL = window.webkitURL.createObjectURL(blob_to_save);
        } else {
        blob_URL = window.URL.createObjectURL(blob_to_save);
        }


        //File Name 

        var html = "<a href='" + blob_URL + "' download='" + "subject_" + id +".csv'> Download CVS </a>";
        html += "<p>" + jsPsych.data.get().csv() + "</p>";
        html += "<button id='btn-end'> End Experiment </button> "

        display_element.innerHTML = html;

        var btn = display_element.querySelector(
            "#btn-end"
        );
        btn.addEventListener("click", function() {
            console.log(blob_URL);
            end_trial();
        });


        const end_trial = () => {
            // kill any remaining setTimeout handlers
            this.jsPsych.pluginAPI.clearAllTimeouts();
  
            // clear the display
            display_element.innerHTML = "";
  
            // move on to the next trial
            this.jsPsych.finishTrial();
        }
      }
    }
    DataDownloadPlugin.info = info;
  
    return DataDownloadPlugin;
  })(jsPsychModule);