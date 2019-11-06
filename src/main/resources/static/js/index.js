var appealsAPI = Vue.resource('appeal{/id}');

function getIndex(list, id){
    for (var i = 0; i < list.length; i++) {
        if (list[i].id === id){
            return i;
        }
    }
    return -1;
}

Vue.component('appeal-form', {
    props: ['appeals', 'appealAttr'],
    data: function(){
        return {
            text: '',
            id: '',
            idCategory: ''
        }
    },
    watch: {
        appealAttr: function (newValue, oldValue) {
            this.text = newValue.text;
            this.id = newValue.id;
        }
    },
    //карточки записей
    template:   '<div>' +
                    '<button type="button" class="btn btn-outline-primary" data-toggle="modal" data-target="#reg-modal">Зарегистрировать новое обращение</button>' +
                    '<div class="modal fade" id="reg-modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">' +
                        '<div class="modal-dialog modal-dialog-centered" role="document">' +
                          '<div class="modal-content">' +
                            '<div class="modal-header">' +
                              '<h5 class="modal-title" id="exampleModalLongTitle">Регистрация нового обращения</h5>' +
                            '</div>' +
                            '<div class="modal-body">' +
                                '<form>' +
                                    '<div class="form-group">' +
                                    '<label for="textAppeal">Введите суть обращения</label>' +
                                        '<textarea class="form-control" id="textAppeal" placeholder="Введите текст обращения" v-model="text" rows="5"></textarea>' +
                                    '</div>' +
                                    '<div class="form-group">' +
                                        '<label for="exampleFormControlSelect1">Выберите категорию обращения</label>' +
                                        '<select class="form-control" id="exampleFormControlSelect1" v-model="idCategory">' +
                                            '<option>1</option>' +
                                            '<option>2</option>' +
                                            '<option>3</option>' +
                                            '<option>4</option>' +
                                            '<option>5</option>' +
                                        '</select>' +
                                    '</div>' +
                                '</form>' +
                            '</div>' +
                            '<div class="modal-footer">' +
                              '<button type="button" class="btn btn-secondary" data-dismiss="modal" @click="clear">Отменить</button>' +
                              '<button type="button" class="btn btn-primary" @click="save" data-dismiss="modal">Зарегистрировать</button>' +
                            '</div>' +
                          '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="modal fade" id="update-modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">' +
                        '<div class="modal-dialog modal-dialog-centered" role="document">' +
                          '<div class="modal-content">' +
                            '<div class="modal-header">' +
                              '<h5 class="modal-title" id="exampleModalLongTitle">Изменение обращения</h5>' +
                            '</div>' +
                            '<div class="modal-body">' +
                                '<input type="text" placeholder="Введите текст обращения" v-model="text"/> ' +
                            '</div>' +
                            '<div class="modal-footer">' +
                              '<button type="button" class="btn btn-secondary" data-dismiss="modal" @click="clear">Отменить</button>' +
                              '<button type="button" class="btn btn-primary" @click="save" data-dismiss="modal">Изменить</button>' +
                            '</div>' +
                          '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>',
    methods: {
        save: function() {
            var appeal = {text: this.text, idCategory: this.idCategory};

            //Если есть id -> обновляем (PUT)
            if(this.id){
                appealsAPI.update({id: this.id}, appeal).then(result=>
                    result.json().then(data => {
                        var index = getIndex(this.appeals, data.id);
                        this.appeals.splice(index, 1, data);
                        this.clear();
                    })
                )
            }
            // иначе -> сохраняем (POST)
            else {
                appealsAPI.save({}, appeal).then(result =>
                    result.json().then(data => {
                        this.appeals.push(data);
                        this.clear();
                    })
                )
            }
        },
        clear: function() {
            this.text = '';
            this.id = ''
        }
    }
});

Vue.component ('appeal-row', {
    props: ['appeal', 'editAppeal', 'appeals'],
    template:   '<div class="card border-dark">' +
                    '<div class="card-header" style="background-color: #3E97D1;">' +
                        '<ul class="list-group list-group-flush">' +
                            '<li class="list-group-item pt-0 pb-0">Номер обращения: {{ appeal.id }}</li>' +
                            '<li class="list-group-item pt-0 pb-0"><small class="text-muted"> Категория обращения: {{ appeal.idCategory }} </small></li>' +
                        '</ul>' +
                    '</div>' +
                    '<div class="card-body">' +
                        '<p class="card-text">{{ appeal.text }}</p>' +
                    '</div>' +
                    '<div class="card-footer bg-transparent border-dark p-0">' +
                        '<div class="row">' +
                            '<div class="col">' +
                                '<ul class="list-group list-group-flush">' +
                                    '<li class="list-group-item pt-0 pb-0"><small class="text-muted">Дата создания обращения: {{ appeal.creationDate }}</small></li>' +
                                    '<li class="list-group-item pt-0 pb-0"><small class="text-muted">Обращение зарегистрировал: {{ appeal.username }} </small></li>' +
                                    '<li class="list-group-item p-0">' +
                                        '<div class="row m-0">' +
                                            '<div class="col p-0">' +
                                                '<button type="button" data-toggle="modal" data-target="#update-modal" class="btn btn-outline-primary btn-block rounded-0 border-0 p-0" @click="edit">Редактировать' +
                                                '</button>' +
                                            '</div>' +
                                            '<div class="col p-0">' +
                                                '<button type="button" @click="del" class="btn btn-outline-danger btn-block border-0 rounded-0 p-0">Удалить' +
                                                '</button>' +
                                            '</div>' +
                                        '</div>' +
                                    '</li>' +
                                '</ul>' +
                            '</div>' +
                        '</div> ' +
                    '</div>' +
                '</div>',
    methods: {
        edit: function () {
            this.editAppeal(this.appeal)
        },
        //DELETE
        del: function(){
            appealsAPI.remove({id: this.appeal.id}).then(result => {
                if (result.ok){
                    this.appeals.splice(this.appeals.indexOf(this.appeal), 1)
                }
            })
        }
    }
});

Vue.component ('appeals-list', {
    props: ['appeals'],
    data: function(){
        return {
            appeal: null
        }
    },
    template:   '<div class="mt-3">' +
                    '<appeal-form :appeals="appeals" :appealAttr="appeal"/>' +
                    '<h3 class="mt-2 text-center">Список зарегистрированных обращений</h3>' +
                    '<div class="card-columns">' +
                        '<appeal-row v-for="appeal in appeals" :key="appeal.id"' +
                        ':appeal="appeal" :editAppeal="editAppeal" :appeals="appeals"/>' +
                    '</div>' +
                '</div>',
    //Отображение карточек записей (GET)
    created: function() {
        appealsAPI.get().then(result =>
            result.json().then(data =>
                data.forEach(appeal => this.appeals.push(appeal))
            )
        )
    },
    methods: {
        editAppeal: function(appeal){
            this.appeal = appeal;
        }
    }
});

var app = new Vue({
    el: '#app',
    template:   '<div>' +
                    '<appeals-list :appeals="appeals"/>' +
                '</div>',
    data: {
        appeals: [],
    }
});