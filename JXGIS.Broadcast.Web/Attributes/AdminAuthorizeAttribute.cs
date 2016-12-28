using JXGIS.Broadcast.BaseLib;
using JXGIS.Broadcast.Entity;
using System.Web;
using System.Web.Mvc;

namespace JXGIS.Broadcast.Web
{
    public class AdminAuthorizeAttribute : AuthorizeAttribute
    {
        /// <summary>
        /// 重写自定义授权检查
        /// </summary>
        /// <returns></returns>
        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {
#if DEBUG
            if (httpContext.Session["User"] == null)
                httpContext.Session["User"] = Business.UserUtils.GetAdmin();
#endif
            return httpContext.Session["User"] != null;
        }

        /// <summary>
        /// 重写未授权的 HTTP 请求处理
        /// </summary>
        protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
        {
            filterContext.Result = new RedirectResult(SystemUtility.Config.DefaultPage.ToString());
        }
    }
}