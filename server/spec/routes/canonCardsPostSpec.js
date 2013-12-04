/*it('mods can save canon cards', function(done) {
 var request = {
 session: {
 userId: 2
 },
 body: {
 name: 'CanonIAm'
 }
 };

 cardsGet(request, {apiOut: function(code, body) {
 cardIdCanon = JSON.parse(body)._id;
 cardsGet({session: {userId: 1, group: 'mod'}, body: {cardId: cardIdCanon, canon:true}}, {apiOut: function(code, body) {
 expect(JSON.parse(body).canon).toBe(true);
 done();
 }});
 }});
 });*/