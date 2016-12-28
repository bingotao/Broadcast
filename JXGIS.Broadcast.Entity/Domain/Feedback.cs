using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JXGIS.Broadcast.Entity
{
    [Table("Feedback")]
    public class Feedback
    {
        [Key]
        public string ID { get; set; }


        public string PB_ID { get; set; }

        public int? IsUseful { get; set; }

        public string Content { get; set; }

        public string IP { get; set; }

        private DateTime _CreateTime = DateTime.Now;
        public DateTime? CreateTime
        {
            get { return this._CreateTime; }
            set { this._CreateTime = value ?? DateTime.Now; }
        }

        private int _IsValid = 1;
        public int? IsValid
        {
            get { return this._IsValid; }
            set { this._IsValid = value ?? 1; }
        }
    }
}
