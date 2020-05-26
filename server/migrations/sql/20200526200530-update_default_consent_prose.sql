WITH n (id) as (SELECT id FROM consent WHERE is_default = TRUE)
UPDATE consent SET prose = '<p><p>Educators and researchers in the <a href="http://tsl.mit.edu/">MIT Teaching Systems Lab</a> would like to include your responses in research about improving this experience and learning how to better prepare teachers for the classroom.<br><br>All data you enter is protected by <a href="https://couhes.mit.edu/">MIT&apos;s IRB review procedures</a>.</p><p>None of your personal information will be shared.<br><br>More details are available in the consent form itself.</p></p>'
FROM n WHERE consent.id = n.id;
-- Up above
---
-- Down below
WITH n (id) as (SELECT id FROM consent WHERE is_default = TRUE)
UPDATE consent SET prose = 'Educators and researchers in the <a href="http://tsl.mit.edu/">MIT Teaching Systems Lab</a> would like to include your responses in research about improving this experience and learning how to better prepare teachers for the classroom.<br><br>All data you enter is protected by <a href="https://couhes.mit.edu/">MIT&apos;s IRB review procedures</a>. None of your personal information will be shared.<br><br>More details are available in the consent form itself.'
FROM n WHERE consent.id = n.id;
