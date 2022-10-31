import grapesjs from 'grapesjs';

const stopPropagation = e => e.stopPropagation();

export default grapesjs.plugins.add('gjs-plugin-ckeditor5', (editor, opts = {}) => {
  let c = opts;

  let defaults = {
    // CKEditor options
    options: {},

    // On which side of the element to position the toolbar
    // Available options: 'left|center|right'
    position: 'left',
  };

  // Load defaults
  for (let name in defaults) {
    if (!(name in c))
      c[name] = defaults[name];
  }

  if (!InlineEditor) {
    throw new Error('ckeditor5 InlineEditor instance not found, check cdn load');
  }

  editor.setCustomRte({
      enable: async (el, rte) => {
        if (rte) {
          rte.destroy();
        }

        // Hide other toolbars
        let rteToolbar = editor.RichTextEditor.getToolbarEl();
        [].forEach.call(rteToolbar.children, (child) => {
          child.style.display = 'none';
        });

        // Init CkEditors
        console.log(opts);
        rte = await InlineEditor.create(el, opts.options);
        rte.getContent = rte.getData;

        // Append the editor
        editor.RichTextEditor.getToolbarEl().appendChild(rte.ui.view.toolbar.element);
        el.contentEditable = true;

        // Do nothing if already focused
        if (rte && rte.editing.view.document.isFocused) {
          return;
        }

        rte && rte.editing.view.focus();

        return rte;
      },

      disable: async (el, rte) => {
        el.contentEditable = false;
      },
    });
});
