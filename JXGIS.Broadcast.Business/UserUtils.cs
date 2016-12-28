using JXGIS.Broadcast.BaseLib;
using JXGIS.Broadcast.Entity;
using System.Web;

namespace JXGIS.Broadcast.Business
{
    public class UserUtils
    {

        public static User GetUser()
        {
            return HttpContext.Current.Session["User"] as User;
        }

        public static void SetUser(User user)
        {
            HttpContext.Current.Session["User"] = user;
        }

        public static void ClearUser()
        {
            HttpContext.Current.Session["User"] = null;
        }

        public static User GetAdmin()
        {
            return new User()
            {
                ID = SystemUtility.Config.User.ID.ToString(),
                UserName = SystemUtility.Config.User.UserName.ToString(),
                Password = SystemUtility.Config.User.Password.ToString(),
                IsAdmin = true
            };
        }
    }
}