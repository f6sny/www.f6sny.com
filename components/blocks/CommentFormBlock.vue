<template>
    <div class="comments-form">
        <Notification v-if="success" type="success" :message="success" />
        <Notification v-if="error" type="danger" :message="error" />

        
        <b-form-group id="comment_field">
            <b-form-textarea id="new_comment_box" v-model="new_comment" rows="2" placeholder="اكتب تعليقك" no-resize></b-form-textarea>
        </b-form-group>
        
        <div class="user-info text-left mb-1">
            <div v-if="isAuthenticated">
                <small>سيتم نشر التعليق بإسم: <mark v-if="isAuthenticated">{{ loggedInUser.username }}</mark></small>
            </div>
            <div v-else>
                <small>
                    التعليقات مسموحة للزوار، الإسم والبريد الإلكتروني مطلوبين للتعليق
                </small>
            </div>
            
        </div>
            
        <b-form-group id="comment_button" v-if="comment_textarea_counter">
            <b-row>
                <b-col>
                    <b-form-group>
                    <b-form-input size="sm" type="text" v-model="comment_author_name" name="commenter_name" id="commenter_name" placeholder="الإسم"></b-form-input>
                    </b-form-group>
                </b-col>
                <b-col>
                    <b-form-group>
                    <b-form-input size="sm" type="email" v-model="comment_author_email" name="commenter_email" id="commenter_email" placeholder="البريد الإلكتروني"></b-form-input>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <b-form-group>
                    <b-button type="submit" id="comment_button" name="comment" class="btn-block" variant="success" size="sm" @click="submit_comment()" >إرسال</b-button>
                    </b-form-group>
                </b-col>
            </b-row>
        </b-form-group>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    props: {
        joke: {
            type: Object,
            default: null,
        }
    },
    data() {
        return {
            new_comment: "",
            success: null,
            error: null,
            comment_author_name: "",
            comment_author_email: "",
            comment_text_area_characters_count: 0,
        }
    },
     computed:{
        ...mapGetters(["isAuthenticated", "loggedInUser"]),
        comment_textarea_counter(){
            this.comment_text_area_characters_count = this.new_comment.length;
            return this.new_comment.length;
        }
    },
    methods: {
        async submit_comment(){
        try {
            let comment = {
                'content': this.new_comment,
                'related': [{
                    'refId': this.joke.id,
                    'ref': 'jokes',
                    'field': 'comments'
                }] 
            }

            if(this.isAuthenticated){
                comment.authorUser = loggedInUser.id;
            }
            else{
                comment.authorName = this.comment_author_name;
                comment.authorEmail = this.comment_author_email;
            }

            const data = await this.$f6snyApi.postComment(comment, this.joke.id);

            this.success = "تم إستلام تعليقك بنجاح";
            this.$store.dispatch('updateCounters')
            this.get_comments();
            this.new_comment= '';
            await new Promise(resolve => setTimeout(resolve, 1500));
            this.success = null;
        } 
        catch (error) {
            this.error = error.response.data.message;
            await new Promise(resolve => setTimeout(resolve, 3000));
            this.error = null;
        }
    },
    }
}
</script>

<style>

</style>