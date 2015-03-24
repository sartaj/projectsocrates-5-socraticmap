(function(window, document, undefined) {

    // Creates an object based in the HTML Element prototype
    var MyElementProto = Object.create(HTMLElement.prototype);

    // Fires when an instance of the element is created
    MyElementProto.attachedCallback = function() {

        // this is the current element
        // $baseDiv is the base element
            var $baseDiv = document.createElement("div");
            var $contentDiv = document.createElement('div');

        // Attributes on this will dictate the final $baseDiv element
            var $attr = this.attributes;

        // ## Gridding

            var CSS_MAP = {
                'col': 'a-Grid-col-xs-',
                'col-small': 'a-Grid-col-xs-',
                'col-large': 'a-Grid-col-md-'
            }

            for(var key in CSS_MAP) {
                if($attr[key]) {
                    $baseDiv.classList.add(CSS_MAP[key] + $attr[key].value);
                }
            }

            // // Have col default to col-small for mobile first purposes
            // if ($attr['col']) {
            //     $attr['col-small'] = $attr['col'];
            // }

            // if ($attr['col-small']) {
            //     $baseDiv.classList.add('a-Grid-col-xs-' + $attr['col-small'].value);
            // }

            // if ($attr['col-large']) {
            //     $baseDiv.classList.add('a-Grid-col-md-' + $attr['col-large'].value)
            // }

        // ### Aligning

            if ($attr['align']) {

                // Expecting align to be either 1 or 2 space separated alignments
                var attrArray = $attr['align'].value.split(" ");

                // If only 1 alignment, make both X and Y the same
                if (attrArray.length === 1) {
                    attrArray.push(attrArray[0]);
                }

                var contentX = attrArray[0];

                var contentY = attrArray[1] || '';

                $baseDiv.classList.add('a-Grid-contentX-xs-' + contentX);

                $baseDiv.classList.add('a-Grid-contentY-xs-' + contentY);

            }


            if ($attr['fullheight']) {

                $baseDiv.classList.add('a-Grid-fullHeight');

            }

            if ($attr['layer']) {

                $baseDiv.classList.add('ebcLayer');
                $baseDiv.classList.add('ebcLayer' + $attr['layer'].value );

            }

        // ### Skinning

            if ($attr['card']) {

                $contentDiv.classList.add('ebcMediaCard');

            }


        // Warn about $attr
        var transferAttr = ['id', 'name'];

        for (var x = 0; x < transferAttr.length; x++) {
            var item = transferAttr[x];
            if ($attr[item]) {
                console.error("ebc-layout: id is using an illegal $attr. " + item + " currently doesnt work.", this );
            }
        }

        // TODO: Transfer classes
        if (this.classList.length) {
            for(var x=0;x<this.classList.length;x++) {
                $contentDiv.classList.add(this.classList[x]);
            }
        }

        if ($attr['col'] || $attr['col-small'] || $attr['col-large']) {
            $baseDiv.appendChild($contentDiv);
        } else {
            $baseDiv.classList.add('a-Grid-row');
            $contentDiv = $baseDiv;
        }


        // ### The new container will be placed next to the native element.
        // Reasoning: The flex-grid system requires the rows to be direct parents of the columns. So any elements in between screw it up. This includes the <ebc-layout> element. So in order to fix this, the container $div/$contentDivs will be placed next to the <ebc-layout> element and then it will self desctruct itself.

            // Transfers child nodes between this and $baseDiv
            // source: http://stackoverflow.com/a/20910214/2026639
            while (this.childNodes.length > 0) {
                $contentDiv.appendChild(this.childNodes[0]);
            }

            // Insert element after this element
            // source: http://stackoverflow.com/a/7258301/2026639
            if(this.parentNode) { // Hack because on the transfer above, some of these get re-run;
                this.parentNode.insertBefore($baseDiv, this.nextSibling);
            }

            // $baseDiv.innerHTML = this.innerHTML;

            // Commit element suicide.
            seppuku(this)

            function seppuku(self) {
                self.remove();
            }

    };

    // Registers element in the main document
    document.registerElement('a-grid', {
        prototype: MyElementProto
    });

})(window, document);