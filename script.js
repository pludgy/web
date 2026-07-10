document.addEventListener('DOMContentLoaded', function () {
  var burger = document.querySelector('[data-mobile-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');
  if (burger && mobileNav) {
    burger.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', mobileNav.classList.contains('is-open'));
    });
  }

  var backToTop = document.querySelector('[data-scroll-top]');
  if (backToTop) {
    backToTop.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  var forms = document.querySelectorAll('[data-form="web3forms"]');
  forms.forEach(function (form) {
    var status = form.querySelector('[data-form-status]');
    var submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var accessKey = form.querySelector('input[name="access_key"]').value;
      if (!accessKey || accessKey === 'YOUR_ACCESS_KEY_HERE') {
        if (status) {
          status.textContent = 'Form not connected yet — add your Web3Forms access key.';
          status.className = 'form-status is-visible is-error';
        }
        return;
      }

      var originalBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
      if (status) {
        status.textContent = '';
        status.className = 'form-status';
      }

      var formData = new FormData(form);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.success) {
            if (status) {
              status.textContent = "Thanks — that's sent. We'll be in touch shortly.";
              status.className = 'form-status is-visible is-success';
            }
            form.reset();
          } else {
            if (status) {
              status.textContent = 'Something went wrong — please try again or call us directly.';
              status.className = 'form-status is-visible is-error';
            }
          }
        })
        .catch(function () {
          if (status) {
            status.textContent = 'Something went wrong — please try again or call us directly.';
            status.className = 'form-status is-visible is-error';
          }
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        });
    });
  });
});
