import { DataSet, Timeline } from 'vis-timeline/standalone';
import historicData from '../database.json';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import UI from './UI.js';
import NetworkGraph from './NetworkGraph.js';

export default class TimelineApp {

    constructor(app) {
        this.app = app;
        this.hoveredItem = undefined;
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
        this.attachHorizontalTimelineEvents();

        // Attach UI components
        this.UI = new UI(this);

        // Initialize the network graph
        this.network = new NetworkGraph(this.app, this);

        // jQuery('#networkContainer').css({ display: 'block' });
        // this.network.createNetworkVisualization(2);
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
        this.locations = [];

        for (let i = 0; i < inputData.length; i++) {
            let obj = inputData[i];

            if (this.locations.indexOf(obj['Wo']) === -1) this.locations.push(obj['Wo']);

            // ID
            obj.id = i;

            // GROUP
            obj.group = this.groupReferences.find(el => el.description === obj['Gruppe']).id;
            obj.className = 'Group-' + obj.group;

            // CONTENT
            obj.content = obj['Was'];

            // ASSOCIATIONS
            obj.keywords = obj['Schlagworte'];

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
            if (obj['Von'] != undefined) {
                timeRange += obj['Von'];
                if (parseFloat(obj['Von']) < 0) timeRange += ' v.Chr.'
            }
            if (obj['Bis'] != undefined) {
                timeRange += ' bis ' + obj['Bis'];
                if (parseFloat(obj['Bis']) < 0) timeRange += ' v.Chr.'
            }
            let tooltip = '<h2 class="tooltipTitle">' + obj['Was'] + '</h2>'
            tooltip += '<div class="primaryGroup">' + obj['Gruppe'] + '</div><p/>';
            tooltip += '<span class="timeIcon"></span> ' + timeRange;
            if (obj['Wo'] != undefined) tooltip += '<br/><span class="locationIcon"></span>' + obj['Wo'];

            if (obj['Kontext'] != undefined) tooltip += '<p/>Kontext: ' + obj['Kontext'];

            tooltip += '<hr span style="margin: 20px 0 20px 0"/>';
            tooltip += '<ul class="tooltip">';
            for (let key in obj) {
                let value = obj[key];
                if (key == 'Wer' || key == 'Stil' || key == 'Wirkung' || key == 'Intention' || key == 'Material' || key == 'Technik' || key == 'Thema' || key == 'Attribute / Symbole' || key == 'Notizen' || key == 'Assoziation (Jahr)') {
                    tooltip += "<li><span>" + key + "</span> &rarr; " + value + '</li>';
                }
            }
            tooltip += '</ul>'

            if (obj['Schlagworte'] != undefined) tooltip += '<i style="font-size: 10px;">Weitere Schlagworte &rarr;  ' + obj['Schlagworte'] + '</i>';
            if (obj['Quelle'] != undefined) tooltip += '<br/><i style="font-size: 10px;">Quelle: ' + obj['Quelle'] + '</i>';
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
        this.items = new DataSet(this.historicData);

        // Configuration for the Timeline
        let options = {
            height: window.innerHeight - 200 + 'px',
            groupOrder: 'content',
            showCurrentTime: false,
            // zoomable: false,
            // horizontalScroll: true,
            orientation: { axis: 'both' },
            zoomMin: 10000000000,




            // Template output (connect to tippy.js)
            template: function (item, element, data) {
                // For all entries (not stacked elements) create a tippy component
                if (data.tooltip != undefined) {
                    tippy(element.parentElement, {
                        content: data.tooltip,
                        placement: 'left',
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
        this.timeline.setItems(this.items);

        // Limit to range
        this.timeline.range.options.min = new Date(-7000, 1);
        this.timeline.range.options.max = new Date(7000, 12);
        // this.timeline.fit(); // or timeline.moveTo( date_within_your_data_set );


    }




    attachHorizontalTimelineEvents() {
        let that = this;
        this.timeline.on('mouseOver', function (props) {
            if (that.UI.activeGroups == 0) {
                if (props.item != null) {
                    if (props.item != that.hoveredItem) {
                        that.hoveredItem = props.item;
                        props.items.push(props.item)

                        // create empty array to hold ids of items with the same class name
                        var sameClassNameIds = [];

                        var selectedItem = that.items.get({
                            filter: function (item) {
                                //return id from timeline matching id in props.items
                                return props.items.indexOf(item.id) !== -1;
                            }
                        });

                        // here is the selected item's className
                        var selectedClassName = selectedItem[0].className;

                        // retrieve all items with the above className
                        var sameClassNameItems = that.items.get({
                            filter: function (item) {
                                //return items from timeline matching query
                                return item.className === selectedClassName;
                            }
                        });

                        // loop over retrieved array of items pushing each item id into an array
                        sameClassNameItems.forEach(function (item) {
                            sameClassNameIds.push(item.id);
                        });

                        // feed the setSelection method the array of ids you'd like it to select and highlight
                        that.timeline.setSelection(sameClassNameIds);
                    }
                } else {
                    if (that.hoveredItem != undefined) {
                        that.hoveredItem = undefined;
                        that.timeline.setSelection([]);
                    }
                }
            } else {
                that.timeline.setSelection(props.item);
            }
        });
    }


}