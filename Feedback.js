class Feedback {
  constructor(fieldId, jsonSrc) {
    this.fieldId = fieldId;
    this.jsonSrc = jsonSrc;
    this.feedbackItems = [];
    this._init(this.jsonSrc);

  }

  _init(src) {
    fetch(src)
      .then(result => result.json())
      .then(data => {
        for (let item of data) {
          this.feedbackItems.push(item);
          this._renderFeedback(item);
        }
      });

    $('#feedbackWrap').on('click', '.validateBtn', (e) => {
      this._validateEventHandler(e.target)
    });
    $('#feedbackWrap').on('click', '.deleteBtn', (e) => {
      this._deleteEventHandler(e.target)
    });
    $('#feedbackForm').on('click', '.submitBtn', (e) => {
      e.preventDefault();
      this._submitEventHandler(e.target);
    });


  }

  _deleteEventHandler(item) {
    let element = this.feedbackItems.find(feedback => feedback.id === $(item).data('id'));
    let idx = this.feedbackItems.indexOf(element);
    this.feedbackItems.splice(idx, 1);
    $(item).closest('.feedbackItem').remove();
    console.log(this.feedbackItems);
  }

  _validateEventHandler(item) {
    let element = this.feedbackItems.find(feedback => feedback.id === $(item).data('id'));
    element.isApproved = true;
    $(item).closest('.feedbackItem').find('.feedbackAuthor').removeClass('notApprovedFb');
    $(item).remove();
  }

  _submitEventHandler(item) {
    let $fbElem = $(item).parent();
    if (!$fbElem.find('.feedbackField').val() || !$fbElem.find('.fbAuthorName').val()) {
      return;
    }
      let newFb = {
        id: +this._getFeedbackIndex() + 1,
        author: $fbElem.find('#fbAuthorName').val(),
        text: $fbElem.find('#feedbackField').val(),
        isApproved: false
      };
      this.feedbackItems.push(newFb);
      this._renderFeedback(newFb);
      $fbElem.find('#fbAuthorName').val('');
      $fbElem.find('#feedbackField').val('');

    }


  _getFeedbackIndex() {
    let lastIdx = this.feedbackItems.length - 1;
    if (lastIdx >= 0) {
      return this.feedbackItems[lastIdx].id
    }
    return 0;

  }

  _renderFeedback(item) {
    let $wrapper = $('<div/>', {
      class: 'feedbackItem'
    });
    $wrapper.append($(`<p class="feedbackAuthor">${item.author}</p>`));
    $wrapper.append($(`<p class="feedbackText">${item.text}</p>`));

    if (!item.isApproved) {
      let $validateBtn = $('<button/>', {
        class: 'red-button validateBtn',
        'data-id': item.id,
        text: 'Validate feedback'

      });
      $wrapper.append($validateBtn);
      $wrapper.find('.feedbackAuthor').addClass('notApprovedFb');
    }
    let $deleteBtn = $('<button/>', {
      class: 'red-button deleteBtn',
      'data-id': item.id,
      text: 'Delete'
    });
    $wrapper.append($deleteBtn);
    $(this.fieldId).append($wrapper);

  }
}