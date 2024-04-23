package uni.HBuilder;
import io.dcloud.uniapp.*;
import io.dcloud.uniapp.extapi.*;
import io.dcloud.uniapp.framework.*;
import io.dcloud.uniapp.runtime.*;
import io.dcloud.uniapp.vue.*;
import io.dcloud.uniapp.vue.shared.*;
import io.dcloud.unicloud.*;
import io.dcloud.uts.*;
import io.dcloud.uts.Map;
import io.dcloud.uts.Set;
import io.dcloud.uts.UTSAndroid;
import kotlinx.coroutines.CoroutineScope;
import kotlinx.coroutines.Deferred;
import kotlinx.coroutines.Dispatchers;
import kotlinx.coroutines.async;
open class GenSrcComponentsAqDialog : VueComponent {
    constructor(instance: ComponentInternalInstance) : super(instance) {
        onCreated(fun() {
            console.log(this.fullscreen, " at src/components/aq-dialog.uvue:45");
        }
        , instance);
    }
    @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
    override fun `$render`(): VNode? {
        val _ctx = this;
        val _cache = this.`$`.renderCache;
        return withDirectives(createElementVNode("view", utsMapOf("class" to "overlay"), utsArrayOf(
            createElementVNode("view", utsMapOf("class" to "dialog-wapper", "style" to normalizeStyle(if (_ctx.fullscreen) {
                utsMapOf("width" to "100%", "height" to "140%");
            } else {
                utsMapOf<String, Any?>();
            }
            )), utsArrayOf(
                createElementVNode("view", utsMapOf("class" to "dialog-close", "hover-class" to "dialog-close-hover"), utsArrayOf(
                    createElementVNode("text", utsMapOf("class" to "text"), "X")
                )),
                createElementVNode("view", utsMapOf("class" to "dialog-body"))
            ), 4)
        ), 512), utsArrayOf(
            utsArrayOf(
                vShow,
                _ctx.visiable
            )
        ));
    }
    open var customClass: String by `$props`;
    open var visiable: Boolean by `$props`;
    open var title: String by `$props`;
    open var width: String by `$props`;
    open var fullscreen: Boolean by `$props`;
    companion object {
        val styles: Map<String, Map<String, Map<String, Any>>>
            get() {
                return normalizeCssStyles(utsArrayOf(
                    styles0
                ));
            }
        val styles0: Map<String, Map<String, Map<String, Any>>>
            get() {
                return utsMapOf("overlay" to padStyleMapOf(utsMapOf("position" to "fixed", "backgroundColor" to "rgba(0,0,0,0.4)", "zIndex" to 2000, "width" to "100%", "height" to "100%", "bottom" to 0)), "dialog-wapper" to utsMapOf(".overlay " to utsMapOf("position" to "relative", "!backgroundColor" to "#ffffff", "zIndex" to 2001, "width" to "500rpx", "minHeight" to 50, "left" to "50%", "top" to "30%", "transform" to "translate(-50%, -50%)")), "dialog-close-hover" to utsMapOf(".overlay .dialog-wapper " to utsMapOf("backgroundColor" to "#000000")), "dialog-close" to utsMapOf(".overlay .dialog-wapper " to utsMapOf("zIndex" to 2002, "position" to "fixed", "right" to "20rpx", "top" to "20rpx", "width" to "40rpx", "height" to "40rpx", "alignItems" to "center", "justifyContent" to "center", "backgroundColor" to "#ff5500", "borderRadius" to "50rpx")), "text" to utsMapOf(".overlay .dialog-wapper .dialog-close " to utsMapOf("textAlign" to "center", "lineHeight" to "40rpx", "color" to "#000000")));
            }
        var inheritAttrs = true;
        var inject: Map<String, Map<String, Any?>> = utsMapOf();
        var emits: Map<String, Any?> = utsMapOf();
        var props = normalizePropsOptions(utsMapOf("customClass" to utsMapOf("type" to "String", "default" to ""), "visiable" to utsMapOf("type" to "Boolean", "required" to true, "default" to false), "title" to utsMapOf("type" to "String", "default" to ""), "width" to utsMapOf("type" to "String", "default" to "50%"), "fullscreen" to utsMapOf("type" to "Boolean", "default" to false)));
        var propsNeedCastKeys = utsArrayOf(
            "customClass",
            "visiable",
            "title",
            "width",
            "fullscreen"
        );
        var components: Map<String, CreateVueComponent> = utsMapOf();
    }
}
