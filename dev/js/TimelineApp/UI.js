import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

export default class UI {

    constructor(timelineApp) {
        this.timelineApp = timelineApp;
        this.init();
    }



    // ---------------------------------------------------------------------------------------------
    // GLOBAL
    // ---------------------------------------------------------------------------------------------


    init() {
        this.attachClickDragTutorial();
        this.attachZoomHandler();
        this.attachNetworkClick();
        this.attachGroupSegmentation();
        this.attachNetworkCloseButton();
        jQuery('#preloader').remove();
    }


    update() {
    }


    resize() {
    }





    // ---------------------------------------------------------------------------------------------
    // CLASS-SPECIFIC FUNCTIONS
    // ---------------------------------------------------------------------------------------------



    attachClickDragTutorial() {
        this.mouseDown = false;
        this.mouseMoved = 0;
        this.tutorialActive = true;
        let that = this;

        this.timelineApp.timeline.on('mouseDown', function (properties) {
            that.mouseDown = true;
        });
        this.timelineApp.timeline.on('mouseUp', function (properties) {
            that.mouseDown = false;
        });
        this.timelineApp.timeline.on('mouseMove', function (properties) {
            if (that.tutorialActive) {
                if (that.mouseDown) {
                    that.mouseMoved++;
                    if (that.mouseMoved > 20) {
                        that.tutorialActive = false;
                        jQuery('#guideWrapper').css({ opacity: 0 });

                        setTimeout(function () {
                            jQuery('#guideWrapper').remove()
                        }, 1000);
                    }
                }
            }
        });
    }



    attachZoomHandler() {
        let that = this;
        document.getElementById('zoomIn').onclick = function () { that.timelineApp.timeline.zoomIn(.5); };
        document.getElementById('zoomOut').onclick = function () { that.timelineApp.timeline.zoomOut(.5); };

        tippy('#zoomIn', {
            content: 'Klicken Sie auf dieses Symbol um den visualisierten Zeitraum des Zeitstrahles zu verkleinern.<p/><i>Hinweis &rarr;</i> Sie können auch das Mausrad nutzen um den dargestellten Zeitraum frei einzustellen.',
            placement: "right",
            delay: [0, 0],
        });
        tippy('#zoomOut', {
            content: 'Klicken Sie auf dieses Symbol um den visualisierten Zeitraum des Zeitstrahles zu vergößern.<p/><i>Hinweis &rarr;</i> Sie können auch das Mausrad nutzen um den dargestellten Zeitraum frei einzustellen.',
            placement: "right",
            delay: [0, 0],
        });
    }


    attachGroupSegmentation() {
        let that = this;
        this.activeGroups = 0;
        for (let i = 0; i < this.timelineApp.groupReferences.length; i++) {
            // Hide all groups
            that.timelineApp.groups.update({
                id: that.timelineApp.groupReferences[i].id,
                visible: false
            });

            // Add checkbox element
            jQuery('#groupSegmentationConatiner ul').append('<li><input type="checkbox" id="Group-' + this.timelineApp.groupReferences[i].id + '" name="Group-' + this.timelineApp.groupReferences[i].id + '" value="' + this.timelineApp.groupReferences[i].id + '"> <label for="Group-' + this.timelineApp.groupReferences[i].id + '">' + this.timelineApp.groupReferences[i].description + '</label></li>')

            // On-click event when user clicks on checkbox
            jQuery('#Group-' + this.timelineApp.groupReferences[i].id).on('click', function () {
                if (this.checked) { that.activeGroups++; } else { that.activeGroups--; }

                // Switch to group-mode
                if (that.activeGroups == 1) {
                    that.timelineApp.timeline.setGroups(that.timelineApp.groups);
                    if (jQuery('#removeAllSelections').css('display') == 'none') {
                        jQuery('#removeAllSelections').css({ display: 'inline-block' });
                    }
                }

                // Disable group mode
                if (that.activeGroups == 0) {
                    that.timelineApp.timeline.setGroups();
                    if (jQuery('#removeAllSelections').css('display') == 'inline-block') {
                        jQuery('#removeAllSelections').css({ display: 'none' });
                    }
                }

                // Show this group
                that.timelineApp.groups.update({
                    id: that.timelineApp.groupReferences[i].id,
                    visible: this.checked
                });
            });
        }


        // Attach remove selection functionality
        jQuery('#removeAllSelections').on('click', function () {
            for (let i = 0; i < that.timelineApp.groupReferences.length; i++) {
                // Hide all groups
                that.timelineApp.groups.update({
                    id: that.timelineApp.groupReferences[i].id,
                    visible: false
                });
                that.activeGroups = 0;

                // Uncheck all checkboxes
                jQuery('#groupSegmentationConatiner li input').each(function () {
                    this.checked = false;
                })

                // Disable group-mode
                that.timelineApp.timeline.setGroups();

                // Hide remove selection buton
                jQuery('#removeAllSelections').css({ display: 'none' });
            }
        });

    }



    attachNetworkClick() {
        this.timelineApp.timeline.on("click", (e) => {
            if (e.item != null) {
                jQuery('#networkContainer').css({ display: 'block' });
                jQuery('#networkContainerElementDetails').html(this.timelineApp.items.get(e.item).tooltip)
                this.timelineApp.network.createNetworkVisualization(e.item);
            }
        });
    }


    attachNetworkCloseButton() {
        jQuery('#networkClose').on('click', function () {
            jQuery('#networkContainer').css({ display: 'none' });
        });
    }

}