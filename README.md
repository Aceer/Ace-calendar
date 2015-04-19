# Ace-calendar
Javascript calendar v.1

Test the calendar live at this link:
http://www.student.bth.se/~alsv13/javascriptKurs/projekt/

(You have to set up a way to connect as a admin your self but in the link above I have made a way to swith between admin and a   normal user)

<b>Main files:</b>
- pluginCalendar.js - This is the main pluginFile.
- adminPluginCalendar.js - This is for the adims panel so thay can change in the calendar.
- plufin-calendar.css - The css file for the calendar (not minified yet).
- img Dir - All the calendars images.

<b>Database files:</b>
(This is just an axampel on how you can get data from the a server, you can create you're own database getter script)
- calGetDataDB.php - Gets the data from the server.
- calUpdateDB.php - Updates the data in the calendar but only if you are admin.
- \inc\classAutoloader.php - Just a file to load classes in php.
- \inc\class\ClassDatabase.php - This is a lightweigh databas class to connect to a databse and get a object from the database

<b>Test files to show how the calendar:</b>
- index.html - Includes the base html for the calendar and just some javascript code to switch between a admin user and a normao   user.
- base.style.css - This is the file to style the index.html.
