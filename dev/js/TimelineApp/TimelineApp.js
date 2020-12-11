import { DataSet, Timeline } from "vis-timeline/standalone";
import historicData from '../database.json';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import moment from 'moment';

export default class TimelineApp {

    constructor(app) {
        this.app = app;
        this.init();
    }



    // ---------------------------------------------------------------------------------------------
    // GLOBAL
    // ---------------------------------------------------------------------------------------------


    init() {
        let rawDataSet = historicData["HistoricData"];

        // Create groups of events
        this.createHistoricGroups(rawDataSet);

        // Remap data to match vis.js requirements
        this.historicData = this.remapHistoricData(rawDataSet);

        // Create horizontal timeline
        this.createHorizontalTimeline();
    }


    update() {
    }


    resize() {
        if (this.timeline) {
            this.timeline.setOptions({
                height: window.innerHeight - 200 + 'px',
            });
        }
    }





    // ---------------------------------------------------------------------------------------------
    // CLASS-SPECIFIC FUNCTIONS
    // ---------------------------------------------------------------------------------------------


    createHistoricGroups(inputData) {
        // CREATE GROUP NAME ARRAY
        this.groupReferences = []; // Array containing the group names
        let currentID = 0; // ID-reference for each group

        for (let i = 0; i < inputData.length; i++) {
            let obj = inputData[i];
            for (let key in obj) {
                if (key == 'Gruppe') {
                    let value = obj[key];

                    // Check if entry in array already exists
                    const found = this.groupReferences.some(el => el.description === value);

                    // If there is no entry with the current value, create a new group entry
                    if (!found) {
                        let newEntry = {
                            id: currentID,
                            description: value
                        };

                        this.groupReferences.push(newEntry);
                        currentID++;
                    }
                }
            }
        }


        // CREATE GROUP DATASET
        this.groups = new DataSet();
        for (let g = 0; g < this.groupReferences.length; g++) {
            this.groups.add({ id: this.groupReferences[g].id, content: this.groupReferences[g].description });
        }
    }



    remapHistoricData(inputData) {
        for (let i = 0; i < inputData.length; i++) {
            let obj = inputData[i];

            // ID
            obj.id = i;

            // GROUP
            obj.group = this.groupReferences.find(el => el.description === obj['Gruppe']).id;

            // CONTENT
            obj.content = obj['Was'];
            // obj.group = 0;

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
                obj.type = 'point';
            }


            // TOOLTIP
            let timeRange = '';
            if (obj['Von'] != undefined) { timeRange += obj['Von']; }
            if (obj['Bis'] != undefined) { timeRange += ' bis ' + obj['Bis']; }
            let tooltip = '<h2 class="tooltipTitle">' + obj['Was'] + '</h2>'
            tooltip += '<i>' + timeRange + '.<br/> ' + obj['Schlagworte'] + '</i>';
            tooltip += '<hr span style="margin: 20px 0 20px 0"/>';
            tooltip += '<ul class="tooltip">';
            for (let key in obj) {
                let value = obj[key];
                if (key == 'Wer' || key == 'Wo' || key == 'Kontext' || key == 'Stil' || key == 'Wirkung' || key == 'Intention' || key == 'Material' || key == 'Technik' || key == 'Thema' || key == 'Attribute / Symbole' || key == 'Notizen' || key == 'Assoziation (Jahr)') {
                    tooltip += "<li><span>" + key + "</span> &rarr; " + value + '</li>';
                }
            }
            tooltip += '</ul>'
            obj.tooltip = tooltip;

            // STYLING
            obj.style = 'font-size: 13px';
        }

        return inputData;
    }





    correctDateFromExcel(input) {
        let correctedDate;
        if (input.length <= 5) {
            // Data only referencing a year
            correctedDate = new Date('2020-01-01');
            correctedDate.setFullYear(input);
        } else {
            // Data with days
            correctedDate = new Date(input)
        }

        return correctedDate;
    }



    createHorizontalTimeline() {
        // HTML container
        let horizontalTimelineContainer = document.getElementById('horizontalTimeline');

        // Define items
        let items = new DataSet(this.historicData);

        // Configuration for the Timeline
        let options = {
            height: window.innerHeight - 200 + 'px',
            groupOrder: 'content',
            showCurrentTime: false,
            // zoomable: false,
            // horizontalScroll: true,
            orientation: {axis: 'both'},
            zoomMin: 10000000000,

            // Template output (connect to tippy.js)
            template: function (item, element, data) {
                // For all entries (not stacked elements) create a tippy component
                if (data.tooltip != undefined) {
                    tippy(element.parentElement, {
                        content: data.tooltip,
                        placement: "top",
                        delay: [0, 0],
                    });
                }

                // Return html data content to DOM
                var html = `<div>
                  ${data.content}
                  </div> `
                return html;
            }
        };

        // Create a Timeline
        this.timeline = new Timeline(horizontalTimelineContainer);
        this.timeline.setOptions(options);
        //this.timeline.setGroups(this.groups);
        this.timeline.setItems(items);

        // // Limit to range
        // this.timeline.range.options.min = new Date(-3500, 1);
        // this.timeline.range.options.max = new Date(2200, 12);
        // this.timeline.fit(); // or timeline.moveTo( date_within_your_data_set );


    }


}