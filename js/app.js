/* Assignment 6: all selectors, traversal, effects and animations use jQuery. */
$(function () {
  'use strict';

  const itemInfo = {
    phone: { icon: '📱', label: 'Phone' },
    glasses: { icon: '👓', label: 'Glasses' },
    bag: { icon: '🛍️', label: 'Bag' },
    cup: { icon: '☕', label: 'Cup' },
    crumbs: { icon: '🍰', label: 'Cake crumbs' }
  };

  const baseParty = [
    {
      name: 'Balcony', floor: 2, guests: [
        { name: 'Aigerim', color: 'green', arrival: '20:45', aitu: true, items: ['cup', 'crumbs'] },
        { name: 'Aliya', color: 'black', arrival: '21:15', aitu: false, items: ['phone', 'cup'] },
        { name: 'Madina', color: 'green', arrival: '22:10', aitu: false, items: ['phone', 'bag', 'crumbs'] },
        { name: 'Ivan', color: 'black', arrival: '20:10', aitu: true, items: ['cup'] }
      ]
    },
    {
      name: 'Hall', floor: 2, guests: [
        { name: 'Arman', color: 'yellow', arrival: '20:35', aitu: false, items: ['bag', 'glasses'] },
        { name: 'Sophia', color: 'purple', arrival: '21:20', aitu: true, items: ['phone'] },
        { name: 'Dias', color: 'green', arrival: '19:45', aitu: true, items: [] },
        { name: 'Bekzat', color: 'purple', arrival: '20:55', aitu: false, items: ['bag', 'cup', 'crumbs'] },
        { name: 'Aruzhan', color: 'blue', arrival: '21:50', aitu: true, items: ['phone'] }
      ]
    },
    {
      name: 'Kitchen', floor: 1, guests: [
        { name: 'Nurlan', color: 'red', arrival: '19:40', aitu: true, items: ['phone', 'cup'] },
        { name: 'Emma', color: 'black', arrival: '20:15', aitu: false, items: ['bag'] },
        { name: 'Timur', color: 'green', arrival: '21:05', aitu: true, items: ['phone', 'bag', 'crumbs'] },
        { name: 'Sergey', color: 'yellow', arrival: '20:50', aitu: false, items: [] },
        { name: 'Yerlan', color: 'red', arrival: '21:40', aitu: true, items: ['glasses', 'phone'] },
        { name: 'Kamila', color: 'green', arrival: '20:05', aitu: false, items: ['cup'] }
      ]
    },
    {
      name: 'Living room', floor: 1, guests: [
        { name: 'Daniel', color: 'blue', arrival: '19:55', aitu: true, items: ['glasses'] },
        { name: 'Zarina', color: 'green', arrival: '21:10', aitu: false, items: ['bag', 'phone', 'crumbs'] },
        { name: 'Natasha', color: 'yellow', arrival: '20:30', aitu: true, items: [] },
        { name: 'Askar', color: 'black', arrival: '21:00', aitu: true, items: ['phone'] },
        { name: 'Inkar', color: 'purple', arrival: '20:20', aitu: false, items: ['bag'] }
      ]
    }
  ];

  const cases = [
    'Who is in the hall?',
    'Who is dressed in yellow or purple?',
    'Which AITU students are upstairs?',
    'Who has glasses or a bag?',
    'Who came with nothing at all?',
    'Who has a phone but no bag?',
    'Who arrived between 20:30 and 21:00?',
    'Who arrived after 21:00 and is not AITU?',
    'Who stands right next to Askar?',
    'Who stands last in each room?',
    'Who stands third in each room?',
    'Who stands after Timur in his room?',
    'Who stands right before someone in black?',
    'In which room is Aruzhan?',
    'Which rooms have fewer than 6 guests?',
    'Which rooms have a cup but no glasses?',
    'Who came first to each room?',
    'Add Miras between Askar and Inkar.',
    'Natasha says goodbye and leaves.',
    'Who took the cake?'
  ];

  let partyState = cloneParty(baseParty);
  let currentMode = 'task1';
  let openedGuest = null;

  function cloneParty(source) {
    return JSON.parse(JSON.stringify(source));
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char];
    });
  }

  function timeToMinutes(time) {
    const parts = time.split(':').map(Number);
    return parts[0] * 60 + parts[1];
  }

  function guestClasses(guest) {
    const classes = ['guest', 'color-' + guest.color];
    if (guest.aitu) classes.push('aitu');
    guest.items.forEach(function (item) { classes.push(item); });
    return classes.join(' ');
  }

  function guestCardHtml(guest, room, index) {
    const itemIcons = guest.items.map(function (item) {
      return '<span class="item-icon" title="' + itemInfo[item].label + '" aria-label="' + itemInfo[item].label + '">' + itemInfo[item].icon + '</span>';
    }).join('');
    const aituBadge = guest.aitu ? '<span class="aitu-badge" title="AITU student">🎓</span>' : '';
    const avatarUrl = 'https://api.dicebear.com/9.x/open-peeps/svg?seed=' + encodeURIComponent(guest.name);
    return '<article class="' + guestClasses(guest) + '" tabindex="0" role="button" aria-label="Open details for ' + escapeHtml(guest.name) + '"' +
      ' data-name="' + escapeHtml(guest.name) + '" data-room="' + escapeHtml(room.name) + '" data-floor="' + room.floor + '"' +
      ' data-color="' + guest.color + '" data-arrival="' + guest.arrival + '" data-arrival-minutes="' + timeToMinutes(guest.arrival) + '"' +
      ' data-order="' + index + '" data-aitu="' + guest.aitu + '" data-phone="' + guest.items.includes('phone') + '"' +
      ' data-glasses="' + guest.items.includes('glasses') + '" data-bag="' + guest.items.includes('bag') + '"' +
      ' data-cup="' + guest.items.includes('cup') + '" data-crumbs="' + guest.items.includes('crumbs') + '">' +
      '<div class="avatar-wrap"><img class="avatar" src="' + avatarUrl + '" alt="' + escapeHtml(guest.name) + ' avatar">' + aituBadge + '</div>' +
      '<strong class="guest-name">' + escapeHtml(guest.name) + '</strong>' +
      '<span class="guest-time">◷ ' + guest.arrival + '</span>' +
      '<div class="guest-items">' + itemIcons + '</div>' +
      '</article>';
  }

  function renderParty() {
    closeDetail(true);
    const $house = $('#house-grid').empty();
    partyState.forEach(function (room) {
      const $room = $('<section class="room"></section>')
        .attr('data-room', room.name)
        .attr('data-floor', room.floor)
        .attr('data-sorted', 'false');
      const $header = $('<div class="room-header"></div>');
      const $titleWrap = $('<div class="room-title-wrap"></div>')
        .append($('<h3 class="room-title"></h3>').text(room.name))
        .append($('<span class="room-floor"></span>').text('Floor ' + room.floor));
      const $count = $('<span class="room-count"></span>').text(room.guests.length + ' guests');
      const $sort = $('<button class="sort-button" type="button">Sort by time ↕</button>');
      $header.append($titleWrap, $count, $sort);
      const $guests = $('<div class="room-guests"></div>');
      room.guests.forEach(function (guest, index) {
        $guests.append(guestCardHtml(guest, room, index));
      });
      $room.append($header, $guests);
      $house.append($room);
    });
  }

  function renderCaseButtons() {
    const $grid = $('#case-grid').empty();
    cases.forEach(function (label, index) {
      $('<button class="case-button" type="button"></button>')
        .attr('data-case', index + 1)
        .attr('title', label)
        .text('Case ' + (index + 1))
        .appendTo($grid);
    });
  }

  function getGuestByName(name) {
    for (let i = 0; i < partyState.length; i += 1) {
      const guest = partyState[i].guests.find(function (item) { return item.name === name; });
      if (guest) return { guest: guest, room: partyState[i] };
    }
    return null;
  }

  function addMiras() {
    const existing = $('.guest[data-name="Miras"]');
    if (existing.length) return existing;

    const living = partyState.find(function (room) { return room.name === 'Living room'; });
    const askarIndex = living.guests.findIndex(function (guest) { return guest.name === 'Askar'; });
    if (askarIndex < 0) return $();

    const miras = { name: 'Miras', color: 'blue', arrival: '21:20', aitu: true, items: ['phone'] };
    living.guests.splice(askarIndex + 1, 0, miras);
    living.guests.forEach(function (guest, index) { guest.order = index; });

    const $askar = $('.guest[data-name="Askar"]');
    const livingRoom = partyState.find(function (room) { return room.name === 'Living room'; });
    const html = guestCardHtml(miras, livingRoom, askarIndex + 1);
    const $miras = $(html).hide().insertAfter($askar);
    $miras.stop(true, false).fadeIn(550);
    updateRoomCount('Living room');
    return $miras;
  }

  function removeNatasha() {
    const $natasha = $('.guest[data-name="Natasha"]');
    if (!$natasha.length) return $();
    const found = $natasha;
    const living = partyState.find(function (room) { return room.name === 'Living room'; });
    living.guests = living.guests.filter(function (guest) { return guest.name !== 'Natasha'; });
    $natasha.stop(true, false).fadeOut(550, function () {
      $(this).remove();
      updateRoomCount('Living room');
    });
    return found;
  }

  function updateRoomCount(roomName) {
    const $room = $('.room').filter(function () { return $(this).attr('data-room') === roomName; });
    $room.find('.room-count').text($room.find('.guest').length + ' guests');
  }

  function findCase(caseNumber) {
    let $found = $();
    let customMessage = '';

    switch (caseNumber) {
      case 1:
        $found = $('.room[data-room="Hall"]').find('.guest');
        break;
      case 2:
        $found = $('.guest.color-yellow, .guest.color-purple');
        break;
      case 3:
        $found = $('.room[data-floor="2"] .guest.aitu');
        break;
      case 4:
        $found = $('.guest').filter(function () {
          return $(this).data('glasses') || $(this).data('bag');
        });
        break;
      case 5:
        $found = $('.guest').filter(function () {
          const $guest = $(this);
          return !$guest.data('phone') && !$guest.data('glasses') && !$guest.data('bag') && !$guest.data('cup') && !$guest.data('crumbs');
        });
        break;
      case 6:
        $found = $('.guest.phone').not('.bag');
        break;
      case 7:
        $found = $('.guest').filter(function () {
          const arrival = Number($(this).attr('data-arrival-minutes'));
          return arrival >= 1230 && arrival <= 1260;
        });
        break;
      case 8:
        $found = $('.guest').filter(function () {
          return Number($(this).attr('data-arrival-minutes')) > 1260 && !$(this).hasClass('aitu');
        });
        break;
      case 9: {
        const $askar = $('.guest[data-name="Askar"]');
        $found = $askar.prev('.guest').add($askar.next('.guest'));
        break;
      }
      case 10:
        $found = $('.room').find('.guest:last-child');
        break;
      case 11:
        $found = $('.room-guests > .guest:nth-child(3)');
        break;
      case 12:
        $found = $('.guest[data-name="Timur"]').next('.guest');
        break;
      case 13:
        $found = $('.guest.color-black').prev('.guest');
        break;
      case 14:
        $found = $('.guest[data-name="Aruzhan"]').closest('.room');
        break;
      case 15:
        $found = $('.room').filter(function () {
          return $(this).find('.guest').length < 6;
        });
        break;
      case 16:
        $found = $('.room').filter(function () {
          const $guests = $(this).find('.guest');
          return $guests.filter('.cup').length > 0 && $guests.filter('.glasses').length === 0;
        });
        break;
      case 17:
        $('.room').each(function () {
          const $guests = $(this).find('.guest');
          const minutes = $guests.map(function () { return Number($(this).attr('data-arrival-minutes')); }).get();
          if (minutes.length) {
            const earliest = Math.min.apply(null, minutes);
            $found = $found.add($guests.filter('[data-arrival-minutes="' + earliest + '"]'));
          }
        });
        break;
      case 18:
        $found = addMiras();
        customMessage = 'Miras was added between Askar and Inkar with a fadeIn() effect.';
        break;
      case 19:
        $found = removeNatasha();
        customMessage = $found.length ? 'Natasha said goodbye. Her card fades out and is removed from the page.' : 'Natasha has already left the party.';
        break;
      case 20:
        $found = $('.room[data-floor="1"] .guest').filter(function () {
          const $guest = $(this);
          const arrival = Number($guest.attr('data-arrival-minutes'));
          const nextIsAitu = $guest.next('.guest').hasClass('aitu');
          const previousIsAitu = $guest.prev('.guest').hasClass('aitu');
          return arrival > 1260 && arrival < 1290 && $guest.hasClass('crumbs') && !$guest.hasClass('cup') && (nextIsAitu || previousIsAitu);
        });
        customMessage = 'The clues identify the cake thief.';
        break;
      default:
        break;
    }

    return { elements: $found, message: customMessage };
  }

  function describeMatches($found) {
    const guests = $found.filter('.guest').map(function () { return $(this).attr('data-name'); }).get();
    const rooms = $found.filter('.room').map(function () { return $(this).attr('data-room'); }).get();
    const nestedGuests = $found.filter('.room').find('.guest').map(function () { return $(this).attr('data-name'); }).get();
    if (guests.length) return { count: guests.length, text: guests.join(', '), type: 'guest' };
    if (rooms.length) return { count: rooms.length, text: rooms.join(', '), type: 'room', nested: nestedGuests };
    return { count: 0, text: 'No matching guests or rooms.', type: 'none' };
  }

  function spotlight($found) {
    const $allGuests = $('.guest');
    $allGuests.stop(true, false).fadeTo(300, 0.2);

    const $directGuests = $found.filter('.guest');
    const $rooms = $found.filter('.room');
    let $jumpTargets = $directGuests;

    if ($rooms.length) {
      $rooms.each(function () {
        $(this).find('.guest').stop(true, false).fadeTo(300, 1);
      });
      $jumpTargets = $jumpTargets.add($rooms.find('.guest'));
    } else {
      $directGuests.stop(true, false).fadeTo(300, 1);
    }

    $jumpTargets.each(function () {
      $(this).stop(true, true).css('position', 'relative').animate({ top: -12 }, 130).animate({ top: 0 }, 130);
    });
  }

  function showResult(caseNumber, result, description) {
    const $result = $('#case-result').empty();
    $('<span class="result-label">Case ' + caseNumber + '</span>').appendTo($result);
    $('<strong></strong>').text(description.count ? description.count + (description.type === 'room' ? ' room(s) found' : ' guest(s) found') + ': ' + description.text : 'No match found').appendTo($result);
    $('<p></p>').text(result.message || cases[caseNumber - 1]).appendTo($result);
  }

  function runCase(caseNumber) {
    if (currentMode === 'task1') {
      partyState = cloneParty(baseParty);
      renderParty();
    }
    $('.case-button').removeClass('is-selected');
    $('.case-button[data-case="' + caseNumber + '"]').addClass('is-selected');
    const result = findCase(caseNumber);
    const description = describeMatches(result.elements);
    showResult(caseNumber, result, description);
    if (caseNumber !== 19) spotlight(result.elements);
    else $('.guest').not(result.elements).stop(true, false).fadeTo(300, 0.2);
  }

  function clearSpotlight() {
    $('.guest').stop(true, false).fadeTo(250, 1).removeClass('is-dimmed');
    $('.case-button').removeClass('is-selected');
    $('#case-result').html('<span class="result-label">Case result</span><strong>Spotlight cleared.</strong><p>All guests are bright again.</p>');
  }

  function closeDetail(instant) {
    if (!openedGuest) return;
    const $overlay = openedGuest.overlay;
    const $panel = openedGuest.panel;
    const anchor = openedGuest.anchor;
    const done = function () {
      $overlay.remove();
      $panel.remove();
      openedGuest = null;
    };
    if (instant || !anchor || !anchor.length || !document.body.contains(anchor[0])) {
      $panel.stop(true, true);
      done();
      return;
    }
    const offset = $(anchor).find('.avatar').offset();
    const left = offset.left - $(window).scrollLeft();
    const top = offset.top - $(window).scrollTop();
    $panel.stop(true, false).animate({ left: left, top: top, width: 58, height: 58, opacity: 0.5 }, 220, done);
    $overlay.stop(true, false).fadeTo(220, 0);
  }

  function openDetail($guest) {
    closeDetail(true);
    const name = $guest.attr('data-name');
    const data = getGuestByName(name);
    if (!data) return;
    const guest = data.guest;
    const room = data.room;
    const avatar = $guest.find('.avatar').attr('src');
    const $avatar = $guest.find('.avatar');
    const origin = $avatar.offset();
    const left = origin.left - $(window).scrollLeft();
    const top = origin.top - $(window).scrollTop();
    const itemsText = guest.items.length ? guest.items.map(function (item) { return itemInfo[item].label.toLowerCase(); }).join(', ') : 'nothing';
    const clothing = guest.color.charAt(0).toUpperCase() + guest.color.slice(1);
    const $overlay = $('<div class="detail-overlay" aria-hidden="true"></div>').appendTo('body');
    const $panel = $('<div class="detail-panel" role="dialog" aria-modal="true" aria-label="Guest details"></div>').appendTo('body');
    const $top = $('<div class="detail-top"></div>');
    const $detailAvatar = $('<img class="detail-avatar" alt="">').attr('src', avatar).css('border-color', getComputedStyle($avatar[0]).borderTopColor);
    const $heading = $('<div class="detail-heading"></div>')
      .append($('<h3></h3>').text(guest.name))
      .append($('<p></p>').text(room.name + ' · Floor ' + room.floor));
    const $close = $('<button class="close-detail" type="button">Close</button>');
    $top.append($detailAvatar, $heading, $close);
    const $content = $('<div class="detail-content"></div>');
    const $facts = $('<div class="detail-facts"></div>');
    [
      ['Arrival', 'Came at ' + guest.arrival],
      ['Student', guest.aitu ? 'AITU student' : 'Not an AITU student'],
      ['Clothing', clothing],
      ['Belongings', guest.items.length ? 'Has ' + itemsText : 'Has nothing']
    ].forEach(function (fact) {
      const $fact = $('<div class="detail-fact"></div>')
        .append($('<small></small>').text(fact[0]))
        .append($('<strong></strong>').text(fact[1]));
      $facts.append($fact);
    });
    $content.append($facts);
    const $moveLabel = $('<p class="detail-actions-label">Move to another room</p>');
    const $moveActions = $('<div class="detail-actions"></div>');
    partyState.filter(function (otherRoom) { return otherRoom.name !== room.name; }).forEach(function (otherRoom) {
      $('<button class="move-button" type="button"></button>')
        .attr('data-target-room', otherRoom.name)
        .text('Move to ' + otherRoom.name)
        .appendTo($moveActions);
    });
    $content.append($moveLabel, $moveActions);
    $panel.append($top, $content);
    $panel.css({ left: left, top: top, width: 58, height: 58, opacity: 0.75, minHeight: 0 });
    openedGuest = { overlay: $overlay, panel: $panel, anchor: $guest[0], name: name };

    const targetWidth = Math.min(430, $(window).width() - 24);
    const targetHeight = 330;
    const targetLeft = Math.max(12, ($(window).width() - targetWidth) / 2);
    const targetTop = Math.max(12, ($(window).height() - targetHeight) / 2);
    $panel.stop(true, false).animate({ left: targetLeft, top: targetTop, width: targetWidth, height: targetHeight, opacity: 1 }, 350, function () {
      $content.stop(true, false).animate({ opacity: 1 }, 150);
    });
  }

  function updatePartyRoomFromDom($room) {
    const roomName = $room.attr('data-room');
    const stateRoom = partyState.find(function (room) { return room.name === roomName; });
    if (!stateRoom) return;
    const orderedNames = $room.find('.guest').map(function () { return $(this).attr('data-name'); }).get();
    stateRoom.guests.sort(function (a, b) { return orderedNames.indexOf(a.name) - orderedNames.indexOf(b.name); });
    stateRoom.guests.forEach(function (guest, index) { guest.order = index; });
    $room.find('.guest').each(function (index) { $(this).attr('data-order', index); });
    updateRoomCount(roomName);
  }

  function moveGuest($guest, targetName) {
    if (!$guest.length) return;
    const name = $guest.attr('data-name');
    const sourceName = $guest.closest('.room').attr('data-room');
    if (sourceName === targetName) return;
    const sourceRoom = partyState.find(function (room) { return room.name === sourceName; });
    const targetRoomState = partyState.find(function (room) { return room.name === targetName; });
    const guestIndex = sourceRoom.guests.findIndex(function (guest) { return guest.name === name; });
    if (guestIndex < 0 || !targetRoomState) return;
    const guestData = sourceRoom.guests.splice(guestIndex, 1)[0];
    targetRoomState.guests.push(guestData);

    const start = $guest.offset();
    const width = $guest.outerWidth();
    const height = $guest.outerHeight();
    const scrollLeft = $(window).scrollLeft();
    const scrollTop = $(window).scrollTop();
    const $flight = $guest.clone().addClass('flight-card').css({
      position: 'fixed', left: start.left - scrollLeft, top: start.top - scrollTop,
      width: width, height: height, margin: 0, opacity: 1
    }).appendTo('body');
    const $oldSlot = $('<div class="guest-slot"></div>').css({ width: width, height: height });
    $guest.before($oldSlot).remove();
    $oldSlot.stop(true, false).animate({ width: 0, height: 0, opacity: 0 }, 500, function () { $(this).remove(); });
    updateRoomCount(sourceName);

    const $targetRoom = $('.room').filter(function () { return $(this).attr('data-room') === targetName; });
    const $targetGuests = $targetRoom.find('.room-guests');
    const $newSlot = $('<div class="guest-slot"></div>').css({ width: 0, height: 0 });
    $targetGuests.append($newSlot);
    $newSlot.stop(true, false).animate({ width: width, height: height, opacity: 1 }, 500, function () {
      const targetIndex = targetRoomState.guests.length - 1;
      const $newCard = $(guestCardHtml(guestData, targetRoomState, targetIndex));
      $newSlot.replaceWith($newCard);
      updateRoomCount(targetName);
    });

    const targetOffset = $targetGuests.offset();
    const targetLeft = targetOffset.left - scrollLeft + Math.max(10, $targetGuests.width() - width - 12);
    const targetTop = targetOffset.top - scrollTop + 20;
    $flight.stop(true, false).animate({ left: targetLeft, top: targetTop, opacity: 0.82 }, 650, function () { $(this).remove(); });
    $('#case-result').html('<span class="result-label">Guest moved</span><strong>' + escapeHtml(name) + ' moved to ' + escapeHtml(targetName) + '.</strong><p>The old place closes and a new place opens with jQuery animations. Run a case in Live house mode to check the updated room.</p>');
  }

  function sortRoom($room) {
    const roomName = $room.attr('data-room');
    const $container = $room.find('.room-guests');
    const wasSorted = $room.attr('data-sorted') === 'true';
    const $cards = $container.children('.guest');
    $cards.stop(true, true);
    const before = new Map();
    $cards.each(function () {
      const offset = $(this).offset();
      before.set(this, { left: offset.left, top: offset.top });
    });

    const ordered = $cards.toArray().sort(function (a, b) {
      const first = wasSorted ? Number($(a).attr('data-order')) : Number($(a).attr('data-arrival-minutes'));
      const second = wasSorted ? Number($(b).attr('data-order')) : Number($(b).attr('data-arrival-minutes'));
      return first - second;
    });
    ordered.forEach(function (card) { $container.append(card); });
    $room.attr('data-sorted', String(!wasSorted));
    $room.find('.sort-button').text(wasSorted ? 'Sort by time ↕' : 'Back to picture order ↶');

    $container.children('.guest').each(function () {
      const oldPosition = before.get(this);
      const newPosition = $(this).offset();
      if (!oldPosition) return;
      const dx = oldPosition.left - newPosition.left;
      const dy = oldPosition.top - newPosition.top;
      $(this).css({ position: 'relative', left: dx, top: dy }).stop(true, false).animate({ left: 0, top: 0 }, 520, function () {
        $(this).css({ position: '', left: '', top: '' });
      });
    });
    updatePartyRoomFromDom($room);
    $('#case-result').html('<span class="result-label">Room sorted</span><strong>' + escapeHtml(roomName) + ': ' + (wasSorted ? 'picture order restored.' : 'earliest arrival first.') + '</strong><p>Click the same button again to toggle the order.</p>');
  }

  $('#case-grid').on('click', '.case-button', function () {
    const caseNumber = Number($(this).attr('data-case'));
    runCase(caseNumber);
  });

  $('.mode-switch').on('click', '.mode-button', function () {
    currentMode = $(this).attr('data-mode');
    $('.mode-button').removeClass('is-active');
    $(this).addClass('is-active');
    if (currentMode === 'task1') {
      $('#mode-status').text('Task 1 · Rebuild before each case');
      $('#mode-help').text('Each case starts from the original party picture, as required in Task 1.');
    } else {
      $('#mode-status').text('Task 2 · Search the live house');
      $('#mode-help').text('Cases search the current DOM without rebuilding it. Guest moves, Miras and Natasha changes remain in effect.');
    }
  });

  $('#reset-house').on('click', function () {
    partyState = cloneParty(baseParty);
    renderParty();
    clearSpotlight();
  });

  $('#clear-spotlight').on('click', clearSpotlight);

  $('#house-grid').on('click', '.guest', function () {
    openDetail($(this));
  });

  $('#house-grid').on('keydown', '.guest', function (event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openDetail($(this));
    }
  });

  $('body').on('click', '.detail-overlay', function () { closeDetail(false); });
  $('body').on('click', '.detail-panel', function (event) { event.stopPropagation(); });
  $('body').on('click', '.close-detail', function () { closeDetail(false); });

  $('body').on('click', '.move-button', function () {
    const targetName = $(this).attr('data-target-room');
    const guestName = openedGuest ? openedGuest.name : '';
    const $guest = $('.guest').filter(function () { return $(this).attr('data-name') === guestName; });
    closeDetail(true);
    moveGuest($guest, targetName);
  });

  $('#house-grid').on('click', '.sort-button', function () {
    sortRoom($(this).closest('.room'));
  });

  $(document).on('keydown', function (event) {
    if (event.key === 'Escape' || event.key === 'Esc') closeDetail(false);
  });

  renderCaseButtons();
  renderParty();
});
