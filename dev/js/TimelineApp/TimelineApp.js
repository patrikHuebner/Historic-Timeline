import { DataSet, Timeline } from "vis-timeline/standalone";
import historicData from '../database.json';
import tippy from 'tippy.js';
import { delegate } from 'tippy.js';
import 'tippy.js/dist/tippy.css';

export default class TimelineApp {

    constructor(app) {
        this.app = app;
        this.init();
    }



    // ---------------------------------------------------------------------------------------------
    // GLOBAL
    // ---------------------------------------------------------------------------------------------


    init() {
        // Remap data to match vis.js requirements
        this.historicData = this.remapHistoricData(historicData["HistoricData"]);

        // Create horizontal timeline
        this.createHorizontalTimeline();
    }


    update() {
    }


    resize() {
    }





    // ---------------------------------------------------------------------------------------------
    // CLASS-SPECIFIC FUNCTIONS
    // ---------------------------------------------------------------------------------------------


    remapHistoricData(inputData) {
        for (let i = 0; i < inputData.length; i++) {
            let obj = inputData[i];

            // ID
            obj.id = i;

            // CONTENT
            obj.content = obj['Was'];
            obj.group = 0;

            // START
            let startDate = obj['Von'];
            if (startDate == undefined) {
                console.error('Warning: No time specified for ' + obj['Was'] + '. Assuming date of 0.');
                startDate = 0;
            }
            obj.start = this.correctDateFromExcel(startDate);

            // END
            let endDate = obj['Bis'];
            if (endDate != undefined) {
                obj.end = this.correctDateFromExcel(endDate);
            } else {
                obj.group = 1;
            }


            // TOOLTIP
            let tooltip = '';
            tooltip += '<h2>'+obj['Was']+'</h2>'
            tooltip += '<ul>';
            for (var key in obj) {
                var value = obj[key];
                if (
                    key == 'Wer' ||
                    key == 'Wo' ||
                    key == 'Kontext' ||
                    key == 'Stil' ||
                    key == 'Wirkung' ||
                    key == 'Intention' ||
                    key == 'Material' ||
                    key == 'Technik' ||
                    key == 'Thema' ||
                    key == 'Attribute / Symbole' ||
                    key == 'Notizen' ||
                    key == 'Assoziation (Jahr)' ||
                    key == 'Schlagworte'
                ) {
                    tooltip += "<li>" + key + ": " + value + '</li>';
                }
            }
            tooltip += '</ul>'
            obj.tooltip = tooltip;

            // STYLING
            // obj.style = 'height:50px';
        }

        return inputData;
    }


    correctDateFromExcel(input) {
        let correctedDate;
        if (input.length <= 5) {
            // Data only referencing a year
            correctedDate = new Date('2020-01-01');
            correctedDate.setYear(input);
        } else {
            // Data with days
            correctedDate = new Date(input)
        }

        return correctedDate;
    }



    createHorizontalTimeline() {
        // HTML container
        let horizontalTimelineContainer = document.getElementById('horizontalTimeline');

        // Groups
        let groups = new DataSet();
        let groupNames = ['Ranged event', 'Singular event'];
        for (let g = 0; g < groupNames.length; g++) {
            groups.add({ id: g, content: groupNames[g] });
        }

        // Define items
        let items = new DataSet(this.historicData);

        // Configuration for the Timeline
        let options = {
            stack: true,
            height: window.innerHeight + 'px',
            cluster: {
                showStipes: true,
                maxItems: 5,
            },
            groupOrder: 'content',



            template: function (item, element, data) {
                if (data.tooltip != undefined) {
                    tippy(element, {
                        content: data.tooltip,
                        placement: "left",
                        delay: [0, 0],
                    });
                }

                var html = `<div>
                  ${data.content}
                  </div> `
                return html;
            }



            // tooltip: {
            //     template: function (originalItemData, parsedItemData) {
            //         // var color = originalItemData.title == 'IN_PROGRESS' ? 'red' : 'green';
            //         // return `<span style="color:${color}">${originalItemData.title}</span>`;
            //         return 'data-tippy-content: "Yo"'
            //     }
            // }
        };

        // Create a Timeline
        let timeline = new Timeline(horizontalTimelineContainer);
        timeline.setOptions(options);
        timeline.setGroups(groups);
        timeline.setItems(items);

        // delegate('#horizontalTimeline', {
        //     target: '.tippyToolTip',
        // });

        // tippy('#horizontalTimeline', {
        //     //target: '.vis-item',
        //     // target: '[data-tippy-content]',
        //     content: "I'm a Tippy tooltip!",
        // });
    }


}