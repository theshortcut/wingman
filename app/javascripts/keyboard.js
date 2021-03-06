function initKeyboardHandlers() {
  // TODO: I wish this responder chain could be modelled correctly
  var nextResponder = $();

  function saveField(e) {
    saveEditable();
    closeEditable();
  }

  $('.todo-items :input').live('focus', function() {
    nextResponder = $(this).closest('li').next();
  });

  $(document).bind('keyup', function(e) {
    if (e.which === 27) {
      // [esc]
      if ($('.task.details').length > 0
          && $('.editable .field').length === 0) {
        var task = $('.task.details');
        TasksController.closeEditors();
        task.find('.button').click();
      } else if ($('.editable .field').length > 0) {
        closeEditable();
        nextResponder = null;
      } else if ($('.task .highlight').length > 0) {
        $('#project').click();
      }
    }

    if (e.which === 9) {
      // Tab
      if ($('.editable .field').length > 0) saveField(e);
      e.preventDefault();
      if (!nextResponder) nextResponder = $('ul.details li.first');

      if (nextResponder.hasClass('last')) {
        nextResponder.click();
        nextResponder = nextResponder.closest('ul').find('li.first');
      } else {
        nextResponder.click();
      }

      return false;
    }
  });

  $(document).bind('keypress', function(e) {
    if ($(e.target).is(':input')) return;

    if (e.which === 35) {
      // # for delete
      var selectedTask = $('.task .highlight').first();
      if (selectedTask.length > 0) {
        $('.delete-button').click();
        e.preventDefault();
        return;
      }
    }

    if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return;

    if (e.which === 74 || e.which === 106) {
      // j
      // TODO: j and k should select next when a task is open
      TasksController.closeEditors();
      var selectedTask = $('.task .highlight').first(),
          nextElement = $('.task .highlight').closest('li').next().find('.button');
      if (selectedTask.length === 0) {
        $('li.body li.task .button').first().click();
      } else if (nextElement.length > 0) {
        nextElement.click();
      } else {
        $('li.body li.task .button').first().click();
      }
    } else if (e.which === 75 || e.which === 107) {
      // k
      TasksController.closeEditors();
      var selectedTask = $('.task .highlight').first(),
          prevElement = $('.task .highlight').closest('li').prev().find('.button');
      if (selectedTask.length === 0) {
        $('li.body li.task .button').last().click();
        e.preventDefault();
      } else if (prevElement.length > 0) {
        prevElement.click();
        e.preventDefault();
      } else {
        $('li.body li.task .button').last().click();
        e.preventDefault();
      }
    } else if ((e.which === 32 || e.which === 79 || e.which === 111)
               && $('.task .highlight').length > 0) {
      // space or 'o'
      TasksController.open($('.task .highlight').closest('.button'));
      e.preventDefault();
    } else if (e.which === 110) {
      $('.task.add-button').click();
      e.preventDefault();
    }
  });
}

initKeyboardHandlers();

