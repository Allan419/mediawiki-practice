/*jshint multistr: true */
/*  ______________________________________________________________________________________
 * |                                                                                     |
 * |                    === WARNING: GADGET FILE ===                                     |
 * |                  Changes to this page affect many users.                            |
 * | Please discuss changes on the talk page or on [[MediaWiki_talk:Gadgets-definition]] |
 * |	 before editing.                                                                 |
 * |_____________________________________________________________________________________|
 *
*/
// <nowiki>

if (mw.config.get('wgPageName') === 'Sandbox:APITest') {
    var entryGadget = {
        'utilities': {
            'configPath': 'MediaWiki:Gadget-modalForm',
            'gadgetNamespace': function () {
                var grant = mw.config.get('wgTitle').split('/')[0].replace(/ /g, '_');
                return grant;
            },
            'userName': function () {
                return mw.config.get('wgUserName');
            },
            'timeStamp': function () {
                // var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                var current = new Date();
                // Format the date and time as desired
                var date = current.toDateString();
                var time = current.toLocaleTimeString();
                return date + ', ' + time;
            }
        },
        'isEditing':false,
        'formConfig': {
            'template': null,
        },
        'isFormExist': false,
        'fetchScript': function (url) {
            return mw.loader.getScript(url);
        },
        'formHtml' : null,
        'loadForm': function (html, id) {
            if (this.isFormExist === false) {
                $('#' + id).append(html);
                this.isFormExist = true;
            } else {
                return;
            }
        },
        'sendData': function () {
            var inputTitle = $('#entryTitle').val(); // Get input data
            var inputContent = $('#entryContent').val(); // Get input data
            console.log("userName: " + entryGadget.utilities.userName());

            var params = {
                action: 'edit',
                title: mw.config.get('wgPageName'),
                appendtext: '{{Changelog|title=' + inputTitle + '|content=' + inputContent + '|user=' + entryGadget.utilities.userName() + '|date=' + entryGadget.utilities.timeStamp() + '}}',
                format: 'json',
                summary: 'Edited by ' + entryGadget.utilities.userName() + ' on ' + entryGadget.utilities.timeStamp()
            };

            var api = new mw.Api();
            api.postWithToken('csrf', params).done(function (data) {
                // console.log(data);
                mw.notify('Saved!', { autoHide: false });
                $('#modal').modal('hide');
                document.location.reload();
            }).fail(function () {
                alert('Post failed!');
            });
            entryGadget.isEditing = false;
        }
    };
    $(function () {
        (function () {
            $('#entryFormBtn').click(function (e) {
                e.preventDefault();
                
                entryGadget.isEditing = true;
                if (entryGadget.isEditing) {
                    console.log(entryGadget.utilities.userName() + ' ' + entryGadget.utilities.timeStamp());
                }

                var elementId = 'modalBody';
                var entryType = $(this).attr('data-type') || 'taskEntry';
                var entryMode = $(this).attr('data-mode') || 'edit';

                var path = entryGadget.utilities.configPath + '/' + entryType;
                var formHtmlPath = '//wiki.wita.de/w/index.php?title=' + encodeURIComponent(path) + '/form&action=raw&ctype=text/javascript';
                var formConfigPath = '//wiki.wita.de/w/index.php?title=' + encodeURIComponent(path) + '/config&action=raw&ctype=text/javascript';
                // console.log('formHtmlPath: ' + formHtmlPath);

                // fetch the form config params
                entryGadget.fetchScript(formConfigPath).done(function (data, result) {
                    if (result === 'success') {
                        var config = JSON.parse(data);
                        var btnId = config.btnID;
                        elementId = config.elementId;
                        console.log("btnId"); console.log(btnId); console.log("elementId"); console.log(elementId);
                    } else {
                        alert("Warning: Network encountered problem, failed to get config script!");
                    }
                });

                // load 
                entryGadget.fetchScript(formHtmlPath).done(function (data, result) {
                    // console.log("data"); console.log(data); console.log("Result"); console.log(result);
                    entryGadget.formHtml = data;
                    entryGadget.loadForm(data, elementId);
                }).fail(function () {
                    alert("Network encountered problem, failed to get form script!");
                });
            });
            $('#saveData').on('click', entryGadget.sendData);

            // Get all container elements
            var changelogs = document.querySelectorAll('.changelog');

            // Add click event listener to each container
            changelogs.forEach(function (changelog) {
                changelog.addEventListener('click', function (event) {
                    // Check if the clicked element is the container itself
                    if (event.target.classList.contains('fa-pen-to-square')) {
                        // Add the "clicked" class to the container
                        changelog.classList.add('clicked');
                        var date = changelog.querySelector('.changelog-date').innerText;
                        var title = changelog.querySelector('.changelog-title').innerText;
                        var content = changelog.querySelector('.changelog-content').innerText;
                        console.log('date: ' + date + 'title: ' + title + 'content: ' + content);
                        entryGadget.loadForm(entryGadget.formHtml, elementId);
                        $('#modal').modal('show');
                        $('#entryTitle').val(title);
                        $('#entryContent').val(content);
                    }
                });
            });
        })();
    });
}
// </nowiki>
