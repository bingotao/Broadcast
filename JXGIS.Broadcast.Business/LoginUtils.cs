using JXGIS.Broadcast.BaseLib;
using JXGIS.Broadcast.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JXGIS.Broadcast.Business
{
    public class LoginUtils
    {
        public static User ValidateUser(string UserName, string Password)
        {
            string admUserName = SystemUtility.Config.User.UserName.ToString();
            string admPassword = SystemUtility.Config.User.Password;

            //RSA解密
            Password = new RSACryptoService(SystemUtility.Config.RSA.PrivateKey.ToString()).Decrypt(Password);
            if (admUserName == UserName && admPassword == Password)
                return UserUtils.GetAdmin();
            return SystemUtility.EFDbContext.User.Where(p => p.UserName == UserName && p.Password == Password).FirstOrDefault();
        }

        public static void Logout()
        {
            UserUtils.ClearUser();
        }
    }
}
