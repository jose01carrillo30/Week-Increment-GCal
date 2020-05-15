# Week Increment for Google Calendar Custom View
Adds shortcuts to increment the custom week view for Google Calendar one week at a time.

## How do I use it?
Currently, it is pending in the Chrome Web Store. A link to download it will be added here when it is ready!

Press `Ctrl`+`↓` or `Ctrl`+`↑` (where ↓/↑ are arrow keys) to move your view of the calendar 'down' or 'up' one week respectively. 

For this extension to work properly, you must set your Google Calendar's custom view to 2, 3, or 4 weeks (4 recommended).

This app works by modifying the URL of your tab. As such, the page is refreshed every time you increment by a week. Be aware that this means any unsaved changes to an event will be lost when you increment your view.

You can change your shortcuts for this extension by going to chrome://extensions/shortcuts in your browser.

## Why do I want to use it?
Google Calendar lacks continuous scrolling for month view, making it difficult to work with events that cross between months. This extension aims to address this difficulty by allowing users to increment their view a week at a time in a multi-week view. 

#### Sample of posts requesting continuous scrolling, dating back to 2009
* http://www.google.com/support/forum/p/Calendar/thread?tid=3973b7dec7baf410&hl=en
* https://support.google.com/calendar/forum/AAAAd3GaXpETAtbAVhoBZ8/?hl=iw
* https://www.quora.com/Is-there-a-way-to-scroll-Google-Calendar-continuously
* https://www.reddit.com/r/google/comments/4kt69m/google_calendar_smooth_scrolling_on_month_view/
* https://support.google.com/calendar/forum/AAAAd3GaXpEGSjLUEAj4k4/?hl=en&gpf=%23!topic%2Fcalendar%2FGSjLUEAj4k4

While this certainly isn't as nice as continuous scrolling would be, it is a practical solution:
* For the user, it is simpler to just add an extension than migrating their calendar to a different calendar app
* For the developer, it is much simpler than building an entirely new calendar app populated via the Google Calendar API.

## Contribution
Please post any bugs, feature requests, or problems in the Issues tab of this repo.

The core functionality of this project is done, and this is a pretty tiny extension anyways. However, there are some improvements that can be made, and perhaps maintenance that will be required in the future: in these cases, feel free to submit pull requests or discuss in the comments of the Issues if you want to contribute to this project. 
