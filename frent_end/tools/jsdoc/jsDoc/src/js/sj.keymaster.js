
    	/**
		 *元素需要设置tabIndex值后生效元素tabIndex的起始值需要设置为1,<br/>
		 * 元素间的的tabIndex值差为1如果为该控件元素的起始值为富文本框，<br/>
		 * 则对该控件编辑使用操作,不使用tab或者回车跳转操作,后续跳转需手动传入的元素 <br/>
		 *  用放在节点容器内部,传入的容器为容器父元素的第一个节点 *<br/>
		 * <br/>
    	 * sjKeyMaster  实现对tab键和回车键进行处理操作
    	 * @constructor
    	 * @param  {Element} parentEl [需要传入的节点,作为根节点]
    	 */
        function sjKeyMaster(parentEl) {
            this.rootNode = parentEl;
            //对于传入的空白节点做当前元素父节点下一级清除节点处理   
            if (this.rootNode.nodeType == 3) {
                var parent_1 = this.clearWhiteElement(this.rootNode.parentNode);
                this.rootChild = parent_1.firstChild.children;
            }
            else {
                this.clearWhiteElement(this.rootNode);
                this.rootChild = this.rootNode.children;
            }
            this.tabIndexSort();
            this.shortcutKey();
        }
        
        /**
         * @param  {Element} element [当前需要清除的节点，会对该节点的下一级进行遍历删除空白节点]
         * @return {Element}         [传入节点类型]
         */
        sjKeyMaster.prototype.clearWhiteElement = function (element) {
            for (var i = 0; i < element.childNodes.length; i++) {
                var node = element.childNodes[i];
                if ((node.nodeType == 3 && !/\S/.test(node.nodeValue) || node.type == "script")) {
                    node.parentNode.removeChild(node);
                }
            }
            return element;
        };
        sjKeyMaster.prototype.tabIndexSort = function () {
            /**
             * 遍历如果元素没有设置属性值，则为每个元素依次设置tabindex属性值
             */
            var elList = this.rootChild;
            var tab = -1;
            $.each(elList, function () {
                if ($(this).attr("tabIndex") == undefined)
                    $(this).attr("tabIndex", tab + 1);
                else
                    tab = parseFloat($(this).attr("tabIndex"));
            });
            var index;
            var tabindex = 0;
            var currEl;
            
            $(elList).on("keydown", function (e) {
                index = parseInt(document.activeElement.getAttribute("tabindex"));
                currEl = $("[tabindex='" + index + "']")[0];
                var key = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
                /**
                 * 针对tab按键做富文本框的操作处理
                 */
                if (key == 9) {
                    if (currEl) {
                        var elType = $(this).attr("type") || $(this).prop("tagName").toLowerCase();
                        if (elType == "textarea") {
                            var textareaVal = $(this).val() + "     ";
                            $(this).val(textareaVal);
                            return false;
                        }
                    }
                    else {
                        index = 0;
                        currEl = $("[tabindex='" + index + "']")[0];
                        currEl.focus();
                    }
                }
                if (key == 13) {
                    //如果当前选择的节点元素不为null
                    if (currEl != null) {
                        var elType = $(this).attr("type") || $(this).prop("tagName").toLowerCase();
                        currEl = $("[tabindex='" + index + "']")[0];
                        if (currEl) {
                            currEl.focus();
                            if (elType == "textarea") {
                                $(this).val() + "<br/>";
                            }
                            else {
                                index++;
                                currEl = $("[tabindex='" + index + "']")[0];
                                if (currEl)
                                    currEl.focus();
                                else {
                                    index = 1;
                                    currEl = $("[tabindex='" + index + "']")[0];
                                    currEl.focus();
                                }
                            }
                        }
                        else {
                            //如果超过了所以界限不存在将tabindex设置为1
                            index = 1;
                            currEl = $("[tabindex='" + index + "']")[0];
                            currEl.focus();
                        }
                    }
                }
            });
        };
        //组合快捷键处理
        sjKeyMaster.prototype.shortcutKey = function () {
            var elList = this.rootNode.children;
            //let key:any;
            $.each(elList, function () {
                if ($(this).attr("accessKey")) {
                    var keyCodeStr = $.trim($(this).attr("accessKey"));
                    var cType_1 = $(this).prop("type").toLowerCase() || $(this).prop("tagName").toLowerCase();
                    var control_1 = $(this);
                    key(keyCodeStr, function () {
                        if (cType_1 == "button" || cType_1 == "submit" || cType_1 == "a" || cType_1 == "img" || cType_1 == "image") {
                            control_1.click();
                        }
                        if (cType_1 == "text" || cType_1 == "textarea") {
                            control_1.focus();
                        }
                    });
                }
            });
        };