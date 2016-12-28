using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JXGIS.Broadcast.Entity
{
    [Table("User")]
    public class User
    {
        [Key]
        public string ID { get; set; }

        public string UserName { get; set; }

        public string Password { get; set; }


        private DateTime _CreateTime = DateTime.Now;

        public DateTime? CreateTime
        {
            get { return this._CreateTime; }
            set { this._CreateTime = value ?? DateTime.Now; }
        }

        private DateTime _LastModifyTime = DateTime.Now;

        public DateTime? LastModifyTime
        {
            get { return this._LastModifyTime; }
            set { this._LastModifyTime = value ?? DateTime.Now; }
        }

        public string CreateUser { get; set; }

        public string LastModifyUser { get; set; }

        [NotMapped]
        public bool IsAdmin { get; set; }
    }
}