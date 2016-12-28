using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace JXGIS.Broadcast.Entity
{
    [Table("CollectedInfo")]
    public class CapturedInfo
    {
        [NotMapped]
        public string ID { get; set; }

        [Key, Column("ID")]
        public int _ID
        {
            get
            {
                int id = 0;
                int.TryParse(this.ID, out id);
                return id;
            }
            set
            {
                this.ID = value.ToString();
            }
        }

        [Column("Title")]
        public string Title { get; set; }

        private DateTime _cpaturedTime = DateTime.MinValue;

        [Column("DeliverDate")]
        public DateTime? CapturedTime
        {
            get { return this._cpaturedTime; }
            set { this._cpaturedTime = value ?? DateTime.MinValue; }
        }

        [Column("Catagory")]
        public string Catagory { get; set; }

        [Column("Link")]
        public string Link { get; set; }

        [Column("Content")]
        public string Content { get; set; }


        private string _status = "待审核";

        [Column("Status")]
        public string Status
        {
            get { return _status; }
            set { _status = value ?? "待审核"; }
        }

        private int _isValid = 1;

        [Column("IsValid")]
        public int? IsValid
        {
            get { return _isValid; }
            set { _isValid = value ?? 1; }
        }
    }
}
