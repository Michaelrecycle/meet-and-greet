module.exports = function(wsInstance) {
    const router = require('express').Router();
    const companyCtrl = require('../controllers/company')(wsInstance)
    const queueCtrl = require('../controllers/queue')
    
    router.get('/', companyCtrl.getEvent)
    // router.post('/room', companyCtrl.createRoom)
    // router.delete('/room', companyCtrl.deleteRoom)
    
    router.get('/next', companyCtrl.getNextStudent)
    router.post('/kick/:_id', queueCtrl.requeueStuent)
    router.post('/end', companyCtrl.leaveRoom)
    
    return router
}