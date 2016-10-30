var peer = new Peer({key: '7a62ddb5-4eca-40a7-bbbb-332d52f7010f'});
peer.listAllPeers(function(list){
    console.log(list);
    var conns = [];
    for( member in list){
        conns.push({});
    }
});